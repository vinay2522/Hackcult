const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user info to request
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};
