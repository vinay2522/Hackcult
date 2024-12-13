import Web3 from 'web3';
import EvidenceContract from '../contracts/Evidence.json';
class Web3Service {
  constructor() {
    // Initialize Web3 with the given provider or fallback to localhost
    const blockchainUrl = Web3.givenProvider || 'http://localhost:9545';
    this.web3 = new Web3(blockchainUrl);

    // Initialize contract and account as null
    this.contract = null;
    this.account = null;

    // Load the contract address from environment variables
    this.contractAddress = process.env.REACT_APP_COURT_CONTRACT_ADDRESS;
    if (!this.contractAddress) {
      console.error('REACT_APP_CONTRACT_ADDRESS is not defined in environment variables.');
      throw new Error('Smart contract address is missing. Please set REACT_APP_CONTRACT_ADDRESS in .env file.');
    }
  }

  /**
   * Initialize Web3 and connect to MetaMask account.
   */
  async init() {
    try {
      // Check if MetaMask (or any Ethereum provider) is available
      if (!window.ethereum) {
        throw new Error('MetaMask is not detected. Please install MetaMask to use blockchain features.');
      }

      console.log('Requesting MetaMask accounts...');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await this.web3.eth.getAccounts();

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please ensure MetaMask is connected.');
      }

      // Set the first account and initialize the smart contract
      this.account = accounts[0];
      console.log('Connected account:', this.account);

      this.contract = new this.web3.eth.Contract(EvidenceContract.abi, this.contractAddress);
      console.log('Smart contract initialized at address:', this.contractAddress);

      return true; // Initialization successful
    } catch (err) {
      console.error('Web3 Initialization Error:', err.message);
      return false; // Initialization failed
    }
  }

  /**
   * Add evidence to the blockchain.
   * @param {string} ipfsHash - IPFS hash of the evidence file.
   * @param {string} caseNumber - The case number associated with the evidence.
   * @returns {Promise<Object>} - Transaction receipt.
   */
  async addEvidence(ipfsHash, caseNumber) {
    try {
      if (!this.contract || !this.account) {
        throw new Error('Web3 is not initialized. Please connect MetaMask and initialize the service.');
      }

      console.log('Submitting evidence to the blockchain...');
      const transactionReceipt = await this.contract.methods
        .addEvidence(ipfsHash, caseNumber)
        .send({ from: this.account });

      console.log('Evidence submitted successfully:', transactionReceipt);
      return transactionReceipt;
    } catch (err) {
      console.error('Error adding evidence to blockchain:', err.message);
      throw new Error('Failed to add evidence to the blockchain. Ensure MetaMask is connected and the contract is accessible.');
    }
  }

  /**
   * Get evidence from the blockchain.
   * @param {string} evidenceId - The ID of the evidence to retrieve.
   * @returns {Promise<Object>} - Evidence data.
   */
  async getEvidence(evidenceId) {
    try {
      if (!this.contract) {
        throw new Error('Smart contract is not initialized.');
      }

      console.log(`Fetching evidence with ID: ${evidenceId}`);
      const evidence = await this.contract.methods.getEvidence(evidenceId).call();
      console.log('Evidence fetched successfully:', evidence);
      return evidence;
    } catch (err) {
      console.error('Error fetching evidence from blockchain:', err.message);
      throw new Error('Failed to fetch evidence from the blockchain.');
    }
  }
}

export default new Web3Service();
