const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  ipfsHash: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Evidence', evidenceSchema);