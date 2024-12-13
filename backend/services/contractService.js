const Web3 = require('web3');
const EvidenceContract = require('../contracts/Evidence.json');

class contractService {
  constructor() {
    // Connect to the blockchain network using Web3
    this.web3 = new Web3(process.env.BLOCKCHAIN_URL || 'http://localhost:9545'); // Fallback to localhost if not defined
    this.contract = new this.web3.eth.Contract(EvidenceContract.abi, process.env.CONTRACT_ADDRESS);
  }

  // Method to submit evidence to the blockchain
  async submitEvidence(caseNumber, metadataHash, walletAddress) {
    try {
      // Check if contract method expects these parameters in this order
      const result = await this.contract.methods.addEvidence(metadataHash, caseNumber, walletAddress)
        .send({ from: walletAddress });
      return result;
    } catch (error) {
      console.error('Blockchain error:', error);
      throw new Error('Failed to add to blockchain');
    }
  }

  // Method to get accounts from the blockchain
  async getBlockchainAccounts() {
    try {
      const accounts = await this.web3.eth.getAccounts();
      return accounts;
    } catch (error) {
      console.error('Blockchain error:', error);
      throw new Error('Failed to get blockchain accounts');
    }
  }
}

module.exports = new contractService();
