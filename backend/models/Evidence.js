const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  datetime: { type: Date, required: true },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evidence', EvidenceSchema);