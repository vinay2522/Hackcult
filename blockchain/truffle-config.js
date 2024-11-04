require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,  // Make sure this is 7545, not 8545
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.19"
    }
  }
};