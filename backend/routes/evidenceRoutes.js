const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Evidence = require('../models/Evidence');
const multer = require('multer');
const path = require('path');
const pinataService = require('../services/pinataService');
const blockchainService = require('../services/blockchainService');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Add new evidence
router.post('/add', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, caseNumber } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Upload file to IPFS using Pinata
    const ipfsHash = await pinataService.pinFileToIPFS(file.buffer, file.originalname);

    // Submit to blockchain
    const transaction = await blockchainService.addEvidence(caseNumber, ipfsHash, req.user.id);

    // Save to database
    const newEvidence = new Evidence({
      title,
      description,
      caseNumber,
      ipfsHash,
      transactionHash: transaction.transactionHash,
      owner: req.user.id,
    });

    const savedEvidence = await newEvidence.save();

    res.status(201).json({ success: true, evidence: savedEvidence });
  } catch (error) {
    console.error('Error in /add route:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
});

// Get all evidence
router.get('/', auth, async (req, res) => {
  try {
    const evidence = await Evidence.find({ owner: req.user.id });
    res.json({ success: true, evidence });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;