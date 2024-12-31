const Web3 = require('web3');
const path = require('path');
const fs = require('fs');

// Connect to local blockchain (Ganache)
const web3 = new Web3('http://127.0.0.1:7545');

// Load contract ABI and address
const loadContract = async (contractName) => {
    try {
        const contractPath = path.join(__dirname, '..', '..', 'smart-contracts', 'build', 'contracts', `${contractName}.json`);
        const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = contractJson.networks[networkId];
        
        if (!deployedNetwork) {
            throw new Error(`Contract ${contractName} not deployed on network ${networkId}`);
        }

        return new web3.eth.Contract(
            contractJson.abi,
            deployedNetwork.address
        );
    } catch (error) {
        console.error(`Error loading contract ${contractName}:`, error);
        throw error;
    }
};

// Initialize blockchain connection
const initBlockchain = async () => {
    try {
        // Check connection
        await web3.eth.net.isListening();
        
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found in the connected blockchain');
        }

        // Load MainContract
        const contract = await loadContract('MainContract');

        return {
            web3,
            accounts,
            contract
        };
    } catch (error) {
        console.error('Blockchain initialization error:', error);
        throw error;
    }
};

module.exports = {
    web3,
    initBlockchain,
    loadContract
};
