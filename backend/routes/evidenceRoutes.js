const express = require('express');
const router = express.Router();
const { addEvidence, getEvidence, getAllEvidence } = require('../controllers/evidenceController');
const auth = require('../middleware/auth');

router.post('/add', auth, addEvidence);
router.get('/:id', auth, getEvidence);
router.get('/', auth, getAllEvidence);

module.exports = router;