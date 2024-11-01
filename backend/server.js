// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Web3 = require('web3'); // Blockchain library for Ethereum

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Blockchain Setup
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_RPC_URL));

// Check blockchain connection
app.get('/api/blockchain/status', async (req, res) => {
  try {
    const networkId = await web3.eth.net.getId();
    res.json({ message: 'Connected to Blockchain', networkId });
  } catch (error) {
    res.status(500).json({ message: 'Blockchain connection failed', error: error.message });
  }
});

// Example endpoint to retrieve account balance
app.get('/api/blockchain/balance/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const balance = await web3.eth.getBalance(address);
    res.json({ address, balance: web3.utils.fromWei(balance, 'ether') });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve balance', error: error.message });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Evidence Management API with Blockchain Integration is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
