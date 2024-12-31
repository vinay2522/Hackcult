const Web3 = require('web3');
const contractABI = require('../contracts/Court.json').abi;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class BlockchainService {
  constructor() {
    this.initialized = false;
    this.web3 = null;
    this.contract = null;
    this.account = null;
  }

  async ensureInitialized() {
    if (this.initialized) return;

    try {
      // Connect to blockchain
      const provider = process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:7545';
      this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
      
      // Get the contract instance
      const contractAddress = process.env.CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('Contract address not found in environment variables');
      }
      
      this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
      
      // Get accounts and ensure we have access
      const accounts = await this.web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in the blockchain');
      }

      // Use the first account as default
      this.account = accounts[0];

      // Verify we can use this account
      try {
        const balance = await this.web3.eth.getBalance(this.account);
        if (balance === '0') {
          throw new Error('Account has no balance');
        }
        console.log('Account balance:', this.web3.utils.fromWei(balance, 'ether'), 'ETH');
      } catch (error) {
        throw new Error('Cannot access account: ' + error.message);
      }

      console.log('Blockchain service initialized with account:', this.account);
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      throw new Error('Failed to initialize blockchain service: ' + error.message);
    }
  }

  async addEvidence(caseNumber, fileHash, owner) {
    try {
      await this.ensureInitialized();

      // Always use the initialized account for transactions
      const senderAccount = this.account;
      console.log('Using account for transaction:', senderAccount);

      const description = `Evidence submitted for case ${caseNumber}`;
      
      // Estimate gas first
      const gas = await this.contract.methods
        .submitEvidence(caseNumber, fileHash, description)
        .estimateGas({ from: senderAccount });

      // Get current gas price
      const gasPrice = await this.web3.eth.getGasPrice();

      // Send transaction with estimated gas and price
      const result = await this.contract.methods
        .submitEvidence(caseNumber, fileHash, description)
        .send({ 
          from: senderAccount,
          gas: Math.ceil(gas * 1.2), // Add 20% buffer
          gasPrice: gasPrice
        });

      const receipt = await this.web3.eth.getTransactionReceipt(result.transactionHash);

      return {
        transactionHash: result.transactionHash,
        blockNumber: receipt.blockNumber,
        timestamp: Math.floor(Date.now() / 1000)
      };
    } catch (error) {
      console.error('Error adding evidence to blockchain:', error);
      throw new Error('Failed to add evidence to blockchain: ' + error.message);
    }
  }

  async verifyEvidence(transactionHash) {
    try {
      await this.ensureInitialized();

      const receipt = await this.web3.eth.getTransactionReceipt(transactionHash);
      if (!receipt) {
        throw new Error('Transaction not found');
      }

      const events = await this.contract.getPastEvents('EvidenceSubmitted', {
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber
      });

      const event = events.find(e => e.transactionHash === transactionHash);
      if (!event) {
        throw new Error('Evidence event not found');
      }

      const block = await this.web3.eth.getBlock(receipt.blockNumber);

      return {
        verified: true,
        blockNumber: receipt.blockNumber,
        timestamp: block.timestamp,
        caseNumber: event.returnValues.caseNumber,
        evidenceHash: event.returnValues.evidenceHash,
        submitter: event.returnValues.submitter
      };
    } catch (error) {
      console.error('Error verifying evidence:', error);
      throw new Error('Failed to verify evidence: ' + error.message);
    }
  }
}

module.exports = new BlockchainService();
