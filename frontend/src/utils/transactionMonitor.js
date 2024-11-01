const Web3 = require('web3');
const Evidence = require('../models/Evidence');

class TransactionMonitor {
  constructor() {
    this.web3 = new Web3(process.env.BLOCKCHAIN_URL);
    this.lastProcessedBlock = 0;
  }

  async start() {
    setInterval(async () => {
      try {
        const latestBlock = await this.web3.eth.getBlockNumber();
        if (this.lastProcessedBlock === 0) {
          this.lastProcessedBlock = latestBlock - 1;
        }

        for (let i = this.lastProcessedBlock + 1; i <= latestBlock; i++) {
          const block = await this.web3.eth.getBlock(i, true);
          if (block && block.transactions) {
            for (let tx of block.transactions) {
              await this.processTransaction(tx);
            }
          }
        }

        this.lastProcessedBlock = latestBlock;
      } catch (error) {
        console.error('Transaction monitoring error:', error);
      }
    }, 15000); // Check every 15 seconds
  }

  async processTransaction(transaction) {
    try {
      const evidence = await Evidence.findOne({
        transactionHash: transaction.hash
      });

      if (evidence) {
        evidence.blockConfirmations = 
          await this.web3.eth.getBlockNumber() - transaction.blockNumber;
        await evidence.save();
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  }
}

module.exports = new TransactionMonitor();