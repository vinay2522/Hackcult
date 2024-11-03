// backend/utils/blockchain.js
const Web3 = require('web3');
const EvidenceContract = require('../contracts/Evidence.json');

const web3 = new Web3(process.env.BLOCKCHAIN_URL);
const contract = new web3.eth.Contract(EvidenceContract.abi, process.env.CONTRACT_ADDRESS);

const addToBlockchain = async (ipfsHash) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await contract.methods.addEvidence(ipfsHash).send({ from: accounts[0] });
    return result.transactionHash;
  } catch (error) {
    console.error('Blockchain error:', error);
    throw new Error('Failed to add to blockchain');
  }
};

module.exports = { addToBlockchain };const Web3 = require('web3');
const EvidenceContract = require('../contracts/Evidence.json');

const web3 = new Web3(process.env.BLOCKCHAIN_URL);
const contract = new web3.eth.Contract(EvidenceContract.abi, process.env.CONTRACT_ADDRESS);

const addToBlockchain = async (ipfsHash) => {
  try {
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }
    const result = await contract.methods.addEvidence(ipfsHash).send({ from: accounts[0] });
    return result.transactionHash;
  } catch (error) {
    console.error('Blockchain error:', error);
    throw new Error('Failed to add to blockchain');
  }
};

const getBlockchainAccounts = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    return accounts;
  } catch (error) {
    console.error('Blockchain error:', error);
    throw new Error('Failed to get blockchain accounts');
  }
};

module.exports = { addToBlockchain, getBlockchainAccounts };