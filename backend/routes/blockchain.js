const express = require('express');
const router = express.Router();
const { initBlockchain } = require('../config/blockchain');

let blockchainInstance = null;

// Initialize blockchain middleware
router.use(async (req, res, next) => {
    try {
        if (!blockchainInstance) {
            blockchainInstance = await initBlockchain();
        }
        req.blockchain = blockchainInstance;
        next();
    } catch (error) {
        console.error('Blockchain middleware error:', error);
        res.status(500).json({ error: 'Blockchain initialization failed' });
    }
});

// Add a new record
router.post('/add', async (req, res) => {
    try {
        const { data } = req.body;
        const { contract, accounts } = req.blockchain;

        const result = await contract.methods.addRecord(data)
            .send({ from: accounts[0] });

        res.json({
            success: true,
            transactionHash: result.transactionHash,
            recordId: result.events.RecordAdded.returnValues.id
        });
    } catch (error) {
        console.error('Error in /add route:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get a record by ID
router.get('/record/:id', async (req, res) => {
    try {
        const { contract } = req.blockchain;
        const record = await contract.methods.getRecord(req.params.id).call();
        
        res.json({
            success: true,
            record: {
                data: record.data,
                owner: record.owner,
                timestamp: record.timestamp
            }
        });
    } catch (error) {
        console.error('Error in /record route:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get total record count
router.get('/count', async (req, res) => {
    try {
        const { contract } = req.blockchain;
        const count = await contract.methods.getRecordCount().call();
        
        res.json({
            success: true,
            count: count
        });
    } catch (error) {
        console.error('Error in /count route:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
