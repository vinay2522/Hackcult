const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Import your controllers
const {
    uploadEvidence,
    getEvidence,
    getAllEvidence
} = require('../controllers/evidenceController');

// Define routes with proper callback functions
router.post('/upload', auth, upload.single('file'), uploadEvidence);
router.get('/:id', auth, getEvidence);
router.get('/', auth, getAllEvidence);

module.exports = router;