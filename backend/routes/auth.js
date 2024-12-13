const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;
    
    let user = await User.findOne({ $or: [{ email }, { walletAddress }] });
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    user = new User({ username, email, password, walletAddress });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        walletAddress: user.walletAddress
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid Credentials' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ success: true, token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;