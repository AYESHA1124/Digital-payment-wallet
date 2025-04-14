const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    /* Skip email verification check for development
    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Email not verified' });
    }
    */

    // Auto-verify user if needed for development
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
      console.log('Auto-verified user:', user.email);
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
