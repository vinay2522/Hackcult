const Evidence = require('../models/Evidence');
const pinataService = require('../services/pinataService');
const BlockchainService = require('./blockchainService');

class EvidenceService {
  async createEvidence(data, file, walletAddress) {
    try {
      if (!file || !file.buffer || !file.originalname) {
        throw new Error('Invalid file data provided');
      }

      if (!walletAddress) {
        throw new Error('Wallet address is required to create evidence');
      }

      // Pin file to IPFS
      const pinataResponse = await pinataService.pinFileToIPFS(file.buffer, file.originalname);
      const ipfsHash = pinataResponse.ipfsHash;

      // Add evidence to blockchain
      const transaction = await BlockchainService.addEvidence(
        data.caseNumber,
        ipfsHash,
        walletAddress
      );

      // Save to database
      const evidence = new Evidence({
        title: data.title,
        description: data.description,
        caseNumber: data.caseNumber,
        ipfsHash,
        transactionHash: transaction.transactionHash,
        owner: walletAddress, // Explicitly assign walletAddress to owner
      });

      return await evidence.save();
    } catch (error) {
      console.error('Error creating evidence:', error.message);
      throw new Error('Failed to create evidence');
    }
  }
}

module.exports = new EvidenceService();
