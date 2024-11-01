const Evidence = require('../models/Evidence');
const { uploadToIPFS } = require('../utils/ipfs');
const { initWeb3 } = require('../utils/web3');

class EvidenceService {
  async createEvidence(data, file, userId) {
    const ipfsHash = await uploadToIPFS(file.buffer);
    
    const { contract, web3 } = await initWeb3();
    const accounts = await web3.eth.getAccounts();
    
    const transaction = await contract.methods
      .addEvidence(ipfsHash, data.title, data.description)
      .send({ from: accounts[0] });

    const evidence = new Evidence({
      ...data,
      ipfsHash,
      transactionHash: transaction.transactionHash,
      owner: userId
    });

    return await evidence.save();
  }

  async verifyEvidence(evidenceId) {
    const evidence = await Evidence.findById(evidenceId);
    if (!evidence) {
      throw new Error('Evidence not found');
    }

    const { contract } = await initWeb3();
    const blockchainData = await contract.methods
      .getEvidence(evidence.transactionHash)
      .call();

    return {
      isVerified: blockchainData.ipfsHash === evidence.ipfsHash,
      blockchainData,
      databaseData: evidence
    };
  }
}

module.exports = new EvidenceService();