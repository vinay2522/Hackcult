const express = require('express');
const multer = require('multer');
const Evidence = require('../models/Evidence');
const evidenceService = require('../services/evidenceService');
const blockchainService = require('../services/blockchainService');
const pinataService = require('../services/pinataService');
const auth = require('../middleware/auth');
const authRole = require('../middleware/authRole');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Add new evidence (requires authentication)
router.post('/add', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, caseNumber } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ 
        success: false, 
        error: 'File is required' 
      });
    }

    if (!title || !description || !caseNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, description, and case number are required' 
      });
    }

    const evidence = await evidenceService.createEvidence(
      { title, description, caseNumber },
      file,
      req.user.walletAddress
    );

    res.status(201).json({ 
      success: true, 
      evidence,
      message: 'Evidence added successfully'
    });
  } catch (error) {
    console.error('Error in /add route:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'This evidence has already been uploaded'
      });
    }

    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to add evidence' 
    });
  }
});

// Verify evidence by transaction hash (requires authentication and legal authority role)
router.get('/verify/:transactionHash', auth, authRole(['LEGAL_AUTHORITY']), async (req, res) => {
  try {
    const { transactionHash } = req.params;

    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        error: 'Transaction hash is required'
      });
    }

    const verificationResult = await evidenceService.verifyEvidence(transactionHash);
    
    res.status(200).json({
      success: true,
      verification: verificationResult
    });
  } catch (error) {
    console.error('Error verifying evidence:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify evidence'
    });
  }
});

// Get evidence file by IPFS hash (requires authentication and legal authority role)
router.get('/file/:ipfsHash', auth, authRole(['LEGAL_AUTHORITY']), async (req, res) => {
  try {
    const { ipfsHash } = req.params;

    if (!ipfsHash) {
      return res.status(400).json({
        success: false,
        error: 'IPFS hash is required'
      });
    }

    // Verify if the user has access to this evidence
    const evidence = await Evidence.findOne({ ipfsHash });
    if (!evidence) {
      return res.status(404).json({
        success: false,
        error: 'Evidence not found'
      });
    }

    // Get file from IPFS
    const fileData = await pinataService.getFileFromIPFS(ipfsHash);
    
    // Set appropriate headers
    res.setHeader('Content-Type', fileData.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${evidence.title}`);
    
    // Send file
    res.send(fileData.data);
  } catch (error) {
    console.error('Error getting evidence file:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get evidence file'
    });
  }
});

// Get evidence details by transaction hash (requires authentication and legal authority role)
router.get('/details/:transactionHash', auth, authRole(['LEGAL_AUTHORITY']), async (req, res) => {
  try {
    const { transactionHash } = req.params;

    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        error: 'Transaction hash is required'
      });
    }

    const evidenceDetails = await blockchainService.getEvidenceByTransaction(transactionHash);
    const dbEvidence = await Evidence.findOne({ transactionHash });
    
    if (!dbEvidence) {
      return res.status(404).json({
        success: false,
        error: 'Evidence not found'
      });
    }

    res.status(200).json({
      success: true,
      evidence: {
        ...evidenceDetails,
        title: dbEvidence.title,
        description: dbEvidence.description,
        ipfsHash: dbEvidence.ipfsHash,
        timestamp: dbEvidence.timestamp
      }
    });
  } catch (error) {
    console.error('Error getting evidence details:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get evidence details'
    });
  }
});

// Get all evidence for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const evidence = await Evidence.find({ owner: req.user.walletAddress })
      .sort({ createdAt: -1 });
      
    res.status(200).json({ 
      success: true, 
      evidence 
    });
  } catch (error) {
    console.error('Error fetching evidence:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch evidence' 
    });
  }
});

// Get specific evidence by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    
    if (!evidence) {
      return res.status(404).json({ 
        success: false, 
        error: 'Evidence not found' 
      });
    }

    // Check if user owns this evidence
    if (evidence.owner !== req.user.walletAddress) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to view this evidence' 
      });
    }

    // Get blockchain verification
    const verificationResult = await blockchainService.verifyEvidence(evidence.transactionHash);

    res.status(200).json({ 
      success: true, 
      evidence: {
        ...evidence.toObject(),
        verification: verificationResult
      }
    });
  } catch (error) {
    console.error('Error fetching evidence by ID:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch evidence' 
    });
  }
});

module.exports = router;
