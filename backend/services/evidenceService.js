const Evidence = require('../models/Evidence');
const { pinFileToIPFS } = require('../utils/pinata');
const Web3 = require('web3');
const Court = require('../../blockchain/build/contracts/Court.json'); // Corrected path

async function initWeb3() {
  try {
    const web3 = new Web3(process.env.BLOCKCHAIN_URL);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Court.networks[networkId];
    if (!deployedNetwork) {
      throw new Error('Smart contract is not deployed on the detected network');
    }
    const contract = new web3.eth.Contract(Court.abi, deployedNetwork.address);
    return { contract, web3 };
  } catch (error) {
    console.error('Error initializing Web3:', error);
    throw new Error('Failed to initialize Web3');
  }
}

class EvidenceService {
  async createEvidence(data, file, userId) {
    try {
      // Pin file to IPFS
      const pinataResponse = await pinFileToIPFS(file.buffer, file.originalname);
      if (!pinataResponse || !pinataResponse.IpfsHash) {
        throw new Error('Failed to pin file to IPFS');
      }
      const ipfsHash = pinataResponse.IpfsHash;

      // Initialize Web3 and contract
      const { contract, web3 } = await initWeb3();

      // Get accounts for transaction
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No Ethereum accounts found');
      }

      // Add evidence to the blockchain
      const transaction = await contract.methods
        .addEvidence(ipfsHash, data.title, data.description)
        .send({ from: accounts[0] });

      // Save evidence to the database
      const evidence = new Evidence({
        title: data.title,
        description: data.description,
        caseNumber: data.caseNumber,
        ipfsHash: ipfsHash,
        transactionHash: transaction.transactionHash,
        owner: userId,
      });

      return await evidence.save();
    } catch (error) {
      console.error('Error creating evidence:', error);
      throw new Error('Failed to create evidence');
    }
  }

  async verifyEvidence(evidenceId) {
    try {
      const evidence = await Evidence.findById(evidenceId);
      if (!evidence) {
        throw new Error('Evidence not found');
      }

      // Initialize Web3 and contract
      const { contract } = await initWeb3();

      // Retrieve evidence data from the blockchain
      const blockchainData = await contract.methods
        .getEvidence(evidence.transactionHash)
        .call();

      // Verify evidence
      const isVerified = blockchainData.ipfsHash === evidence.ipfsHash;

      return {
        isVerified,
        blockchainData,
        databaseData: evidence
      };
    } catch (error) {
      console.error('Error verifying evidence:', error);
      throw new Error('Failed to verify evidence');
    }
  }
}

module.exports = new EvidenceService();
