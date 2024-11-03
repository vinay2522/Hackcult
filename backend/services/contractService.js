// backend/services/contractService.js
const Web3 = require('web3');
const Court = require('../contracts/Court.json');
require('dotenv').config();

class ContractService {
    constructor() {
        this.web3 = new Web3(process.env.BLOCKCHAIN_URL);
        this.contract = new this.web3.eth.Contract(
            Court.abi,
            process.env.COURT_CONTRACT_ADDRESS
        );
    }

    async submitEvidence(caseNumber, evidenceHash, description, submitterAddress) {
        try {
            const gas = await this.contract.methods
                .submitEvidence(caseNumber, evidenceHash, description)
                .estimateGas({ from: submitterAddress });

            return await this.contract.methods
                .submitEvidence(caseNumber, evidenceHash, description)
                .send({ from: submitterAddress, gas });
        } catch (error) {
            console.error('Contract submission error:', error);
            throw error;
        }
    }

    async getEvidence(id) {
        try {
            return await this.contract.methods.getEvidence(id).call();
        } catch (error) {
            console.error('Contract retrieval error:', error);
            throw error;
        }
    }
}

module.exports = new ContractService();