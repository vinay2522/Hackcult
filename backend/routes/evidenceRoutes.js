const express = require('express');
const multer = require('multer');
const EvidenceService = require('../services/evidenceService');
const BlockchainService = require('../services/blockchainService');
const auth = require('../middleware/auth');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // In-memory storage for files

// Add new evidence
router.post('/add', upload.single('file'), async (req, res) => {
  try {
    const { title, description, caseNumber, walletAddress } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    // Ensure blockchain is initialized
    if (!BlockchainService.account) {
      await BlockchainService.init();
    }

    const ownerAddress = walletAddress || BlockchainService.account; // Use provided walletAddress or default account
    const evidence = await EvidenceService.createEvidence(
      { title, description, caseNumber },
      file,
      ownerAddress
    );

    res.status(201).json({ success: true, evidence });
  } catch (error) {
    console.error('Error in /add route:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get all evidence for the logged-in user

router.get('/', auth, async (req, res) => {
  try {
    const evidence = await Evidence.find({ owner: req.user.id });
    if (!evidence || evidence.length === 0) {
      return res.status(404).json({ message: 'No evidence found' });
    }
    res.status(200).json({ success: true, evidence });
  } catch (error) {
    console.error('Error fetching evidence:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
