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
  caseNumber: {
    type: String,
    required: true
  },
  fileHash: {
    type: String,
    required: true
  },
  ipfsHash: {
    type: String,
    required: false
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: props => `${props.value} is not a valid Ethereum address!`
    }
  },
  storageType: {
    type: String,
    enum: ['local', 'ipfs'],
    required: true,
    default: 'local'
  },
  fileName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create compound index for uniqueness on case number and owner
evidenceSchema.index({ owner: 1, caseNumber: 1 }, { unique: true });

module.exports = mongoose.model('Evidence', evidenceSchema);
