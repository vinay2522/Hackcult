const Evidence = require('../models/Evidence');
const pinataService = require('./pinataService');
const fileStorageService = require('./fileStorageService');
const blockchainService = require('./blockchainService');

class EvidenceService {
  async createEvidence(data, file, walletAddress) {
    try {
      // Input validation
      if (!file || !file.buffer || !file.originalname) {
        throw new Error('Invalid file data provided');
      }

      if (!walletAddress) {
        throw new Error('Wallet address is required');
      }

      if (!data.title || !data.description || !data.caseNumber) {
        throw new Error('Title, description, and case number are required');
      }

      // Initialize blockchain service first
      await blockchainService.ensureInitialized();

      // Now validate wallet address format after blockchain is initialized
      if (!blockchainService.web3.utils.isAddress(walletAddress)) {
        throw new Error('Invalid wallet address format');
      }

      // Check if evidence with same case number exists for this user
      const existingEvidence = await Evidence.findOne({
        owner: walletAddress,
        caseNumber: data.caseNumber
      });

      if (existingEvidence) {
        throw new Error('Evidence for this case number already exists');
      }

      // Save file locally first
      const localFile = await fileStorageService.saveFile(file.buffer, file.originalname);
      let storageType = 'local';
      let ipfsHash = null;

      // Try to upload to IPFS if configured
      try {
        if (process.env.PINATA_API_KEY && process.env.PINATA_API_SECRET) {
          const pinataResponse = await pinataService.pinFileToIPFS(file.buffer, file.originalname);
          if (pinataResponse && pinataResponse.ipfsHash) {
            ipfsHash = pinataResponse.ipfsHash;
            storageType = 'ipfs';
            console.log('File uploaded to IPFS:', ipfsHash);
          }
        }
      } catch (error) {
        console.warn('IPFS upload failed, using local storage:', error.message);
      }

      // Add evidence to blockchain
      console.log('Adding evidence to blockchain...');
      const blockchainResponse = await blockchainService.addEvidence(
        data.caseNumber,
        localFile.fileHash,
        walletAddress
      );

      if (!blockchainResponse || !blockchainResponse.transactionHash) {
        throw new Error('Failed to add evidence to blockchain');
      }
      console.log('Evidence added to blockchain:', blockchainResponse.transactionHash);

      // Save to database
      console.log('Saving evidence to database...');
      const evidence = new Evidence({
        title: data.title,
        description: data.description,
        caseNumber: data.caseNumber,
        fileHash: localFile.fileHash,
        ipfsHash: ipfsHash,
        transactionHash: blockchainResponse.transactionHash,
        blockNumber: blockchainResponse.blockNumber,
        owner: walletAddress,
        storageType: storageType,
        fileName: file.originalname,
        mimeType: localFile.mimeType,
        timestamp: new Date()
      });

      const savedEvidence = await evidence.save();
      console.log('Evidence saved to database');

      return {
        ...savedEvidence.toObject(),
        message: 'Evidence added successfully'
      };
    } catch (error) {
      console.error('Error creating evidence:', error);
      if (error.code === 11000) {
        throw new Error('Evidence with this case number already exists');
      }
      throw error;
    }
  }

  async getEvidenceFile(fileIdentifier, owner) {
    const evidence = await Evidence.findOne({
      $or: [
        { fileHash: fileIdentifier },
        { ipfsHash: fileIdentifier }
      ],
      owner: owner
    });

    if (!evidence) {
      throw new Error('Evidence not found');
    }

    if (evidence.storageType === 'ipfs' && evidence.ipfsHash) {
      try {
        return await pinataService.getFileFromIPFS(evidence.ipfsHash);
      } catch (error) {
        console.warn('IPFS retrieval failed, falling back to local storage');
      }
    }

    return await fileStorageService.getFile(evidence.fileHash);
  }

  async verifyEvidence(transactionHash) {
    try {
      if (!transactionHash) {
        throw new Error('Transaction hash is required');
      }

      // Get blockchain verification
      const verificationResult = await blockchainService.verifyEvidence(transactionHash);

      // Get evidence from database
      const evidence = await Evidence.findOne({ transactionHash });

      if (!evidence) {
        throw new Error('Evidence not found in database');
      }

      return {
        ...verificationResult,
        evidence: {
          ...evidence.toObject(),
          file: {
            type: evidence.storageType,
            hash: evidence.storageType === 'ipfs' ? evidence.ipfsHash : evidence.fileHash
          }
        }
      };
    } catch (error) {
      console.error('Error verifying evidence:', error);
      throw error;
    }
  }

  async getEvidenceByOwner(walletAddress) {
    try {
      if (!walletAddress) {
        throw new Error('Wallet address is required');
      }

      const evidence = await Evidence.find({ owner: walletAddress })
        .sort({ createdAt: -1 });

      return evidence.map(item => ({
        ...item.toObject(),
        file: {
          type: item.storageType,
          hash: item.storageType === 'ipfs' ? item.ipfsHash : item.fileHash
        }
      }));
    } catch (error) {
      console.error('Error fetching evidence:', error);
      throw error;
    }
  }

  async getEvidenceById(id) {
    try {
      const evidence = await Evidence.findById(id);
      if (!evidence) {
        throw new Error('Evidence not found');
      }
      return evidence;
    } catch (error) {
      console.error('Error fetching evidence by ID:', error);
      throw error;
    }
  }
}

module.exports = new EvidenceService();
