const Web3 = require('web3');
const EvidenceContract = require('../../blockchain/build/contracts/EvidenceChain.json');

class BlockchainService {
  constructor() {
    const blockchainUrl = process.env.BLOCKCHAIN_URL || 'http://localhost:9545';
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!blockchainUrl || !contractAddress) {
      throw new Error('BLOCKCHAIN_URL or CONTRACT_ADDRESS is not defined in environment variables.');
    }

    this.web3 = new Web3(blockchainUrl);
    this.contract = new this.web3.eth.Contract(EvidenceContract.abi, contractAddress);
    this.account = null;
  }

  // Initialize Web3 and account (if using MetaMask or other provider)
  async init() {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is not available. Please install MetaMask to interact with the blockchain.');
      }

      console.log('Requesting MetaMask account...');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await this.web3.eth.getAccounts();

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure your MetaMask is connected.');
      }

      this.account = accounts[0];
      console.log('Account initialized:', this.account);
      return true; // Initialization successful
    } catch (error) {
      console.error('Error initializing Web3 and account:', error.message);
      throw new Error('Failed to initialize Web3 or account. Ensure MetaMask is installed and connected.');
    }
  }

  // Method to add evidence to the blockchain
  async addEvidence(ipfsHash, title, description) {
    if (!this.account) {
      throw new Error('Account is not initialized. Please connect to MetaMask.');
    }

    if (!this.contract) {
      throw new Error('Smart contract is not initialized.');
    }

    try {
      console.log('Adding evidence to the blockchain...');
      const result = await this.contract.methods
        .addEvidence(ipfsHash, title, description)
        .send({ from: this.account });

      console.log('Evidence added successfully:', result);
      return result;
    } catch (error) {
      console.error('Error adding evidence to blockchain:', error.message);
      throw new Error('Failed to add evidence to the blockchain.');
    }
  }

  // Method to fetch evidence from the blockchain
  async getEvidence(evidenceId) {
    if (!this.contract) {
      throw new Error('Smart contract is not initialized.');
    }

    try {
      console.log(`Fetching evidence with ID: ${evidenceId}`);
      const result = await this.contract.methods.getEvidence(evidenceId).call();
      console.log('Evidence fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Error fetching evidence from blockchain:', error.message);
      throw new Error('Failed to fetch evidence from the blockchain.');
    }
  }
}

module.exports = new BlockchainService();
