const Evidence = require('../models/Evidence');
const pinataService = require('../services/pinataService');
const blockchainService = require('../services/blockchainService');

exports.addEvidence = async (req, res) => {
  try {
    const { title, description, caseNumber } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Upload file to IPFS using Pinata
    const pinataResponse = await pinataService.uploadFile(file);
    const ipfsHash = pinataResponse.IpfsHash;

    // Submit to blockchain
    const transaction = await blockchainService.addEvidence(caseNumber, ipfsHash, req.user.id);

    // Save to database
    const evidence = new Evidence({
      title,
      description,
      caseNumber,
      ipfsHash,
      transactionHash: transaction.transactionHash,
      owner: req.user.id,
    });

    await evidence.save();
    res.status(201).json({ success: true, evidence });
  } catch (error) {
    console.error('Evidence submission error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);

    if (!evidence) {
      return res.status(404).json({ success: false, error: 'Evidence not found' });
    }

    if (evidence.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'User not authorized' });
    }

    // Verify evidence on blockchain
    const blockchainEvidence = await blockchainService.getEvidence(evidence.transactionHash);

    if (!blockchainEvidence) {
      return res.status(404).json({ success: false, error: 'Evidence not found on blockchain' });
    }

    const isVerified = blockchainEvidence.ipfsHash === evidence.ipfsHash;

    res.json({ success: true, evidence, isVerified });
  } catch (error) {
    console.error('Get evidence error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find({ owner: req.user.id }).sort({ createdAt: -1 });

    if (!evidence.length) {
      return res.status(404).json({ success: false, error: 'No evidence found' });
    }

    res.json({ success: true, evidence });
  } catch (error) {
    console.error('Get all evidence error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
