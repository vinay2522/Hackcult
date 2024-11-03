// backend/models/Evidence.js
const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    dateTime: {
        type: Date,
        required: [true, 'Please provide date and time']
    },
    location: {
        type: String,
        required: [true, 'Please provide a location']
    },
    ipfsHash: {
        type: String,
        required: [true, 'IPFS hash is required']
    },
    transactionHash: {
        type: String,
        required: [true, 'Blockchain transaction hash is required']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Evidence', EvidenceSchema);