const Web3 = require('web3');
const Evidence = require('../contracts/Evidence.json');

let web3;
let contract;

const initWeb3 = async () => {
  web3 = new Web3(process.env.BLOCKCHAIN_URL);
  contract = new web3.eth.Contract(
    Evidence.abi,
    process.env.CONTRACT_ADDRESS
  );
  return { web3, contract };
};

const getAccounts = async () => {
  if (!web3) {
    await initWeb3();
  }
  return await web3.eth.getAccounts();
};

module.exports = {
  initWeb3,
  getAccounts
};