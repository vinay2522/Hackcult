const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const evidenceRoutes = require('./routes/evidenceRoutes');
const BlockchainService = require('./services/blockchainService');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize blockchain service
BlockchainService.init()
  .then(() => console.log('Blockchain service initialized'))
  .catch(err => console.error('Blockchain initialization error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/evidence', evidenceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
