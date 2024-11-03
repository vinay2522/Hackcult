const Evidence = require('../models/Evidence');
// backend/controllers/evidenceController.js
const contractService = require('../services/contractService');
const ipfsService = require('../services/ipfsservice');

exports.addEvidence = async (req, res) => {
    try {
        const { title, description, caseNumber } = req.body;
        const file = req.file;

        // Upload file to IPFS
        const ipfsHash = await ipfsService.uploadToIPFS(file.buffer);

        // Submit to blockchain
        const transaction = await contractService.submitEvidence(
            caseNumber,
            ipfsHash,
            description,
            req.user.walletAddress
        );

        // Save to database
        const evidence = new Evidence({
            title,
            description,
            caseNumber,
            ipfsHash,
            transactionHash: transaction.transactionHash,
            owner: req.user.id
        });

        await evidence.save();
        res.status(201).json({ success: true, evidence });

    } catch (error) {
        console.error('Evidence submission error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.addEvidence = async (req, res) => {
  try {
    const { title, description, datetime, location } = req.body;
    const newEvidence = new Evidence({
      title,
      description,
      datetime,
      location,
      owner: req.user.id
    });
    const evidence = await newEvidence.save();
    res.json(evidence);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) {
      return res.status(404).json({ msg: 'Evidence not found' });
    }
    if (evidence.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    res.json(evidence);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Evidence not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.getAllEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find({ owner: req.user.id }).sort({ date: -1 });
    res.json(evidence);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const evidenceService = require('../services/evidenceService');

exports.addEvidence = async (req, res) => {
  try {
    const evidence = await evidenceService.createEvidence(req.body, req.file, req.user.id);
    res.status(201).json(evidence);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating evidence' });
  }
};