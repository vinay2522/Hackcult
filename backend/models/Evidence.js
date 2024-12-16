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
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Simple Ethereum address validation (42 characters, starts with "0x")
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Ethereum address!`,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Evidence', EvidenceSchema);
