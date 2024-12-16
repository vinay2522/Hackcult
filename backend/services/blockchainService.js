const Web3 = require('web3');
const EvidenceContract = require('../contracts/Evidence.json');
require('dotenv').config();

class BlockchainService {
  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_URL));
    this.contract = new this.web3.eth.Contract(EvidenceContract.abi, process.env.CONTRACT_ADDRESS);
    this.account = null;
  }

  // Initialize blockchain account
  async init() {
    try {
      const accounts = await this.web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No blockchain accounts found');
      }
      this.account = accounts[0];
      console.log('Blockchain service initialized with account:', this.account);
      return true;
    } catch (error) {
      console.error('Blockchain initialization error:', error.message);
      throw new Error('Failed to initialize blockchain');
    }
  }

  // Submit evidence to blockchain
  async addEvidence(caseNumber, ipfsHash, walletAddress) {
    try {
      const result = await this.contract.methods
        .addEvidence(ipfsHash, caseNumber)
        .send({ from: walletAddress || this.account, gas: 3000000 });

      return result;
    } catch (error) {
      console.error('Error adding evidence to blockchain:', error.message);
      throw new Error('Failed to add evidence to blockchain');
    }
  }

  // Retrieve evidence from blockchain
  async getEvidence(evidenceId) {
    try {
      const result = await this.contract.methods.getEvidence(evidenceId).call();
      return result;
    } catch (error) {
      console.error('Error fetching evidence from blockchain:', error.message);
      throw new Error('Failed to fetch evidence from blockchain');
    }
  }
}

module.exports = new BlockchainService();
