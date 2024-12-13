const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  caseNumber: {
    type: String,
    required: true,
  },
  ipfsHash: {
    type: String,
    required: true,
  },
  transactionHash: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Evidence', EvidenceSchema);