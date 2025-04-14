const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const auth = require('../middleware/auth');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// @desc    Register user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create user
    user = await User.create({ name, email, password });

    // For development only - automatically verify users without email verification
    user.isVerified = true;
    await user.save();

    /* Commented out email verification for development
    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message: `Please verify your email by clicking: ${verificationUrl}`
    });
    */

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      success: true,
      token,
      name: user.name,
      email: user.email,
      _id: user._id,
      isVerified: user.isVerified,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      walletBalance: user.walletBalance,
      preferredTheme: user.preferredTheme
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find the user with this token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired verification token' 
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirect to the frontend verification success page
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?verified=true`);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log(`Login attempt for ${email}: Password match result: ${isMatch}`);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    /* Skip email verification check for development
    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email not verified',
        verificationRequired: true
      });
    }
    */

    // For development, consider all users verified
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200).json({
      success: true,
      token,
      name: user.name,
      email: user.email,
      _id: user._id,
      isVerified: user.isVerified,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      walletBalance: user.walletBalance,
      preferredTheme: user.preferredTheme
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ success: false, error: 'Email already verified' });
    }
    
    // Generate new verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message: `Please verify your email by clicking: ${verificationUrl}`
    });
    
    res.status(200).json({ success: true, message: 'Verification email sent' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      walletBalance: user.walletBalance,
      createdAt: user.createdAt,
      preferredTheme: user.preferredTheme
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Check 2FA status
// @route   GET /api/auth/two-factor/status
router.get('/two-factor/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      isEnabled: user.isTwoFactorEnabled
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Setup 2FA
// @route   POST /api/auth/two-factor/setup
router.post('/two-factor/setup', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Generate secret
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `Digital Wallet:${user.email}`
    });
    
    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    
    // Save temporary secret
    user.twoFactorTempSecret = secret.base32;
    await user.save();
    
    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Verify and enable 2FA
// @route   POST /api/auth/two-factor/verify
router.post('/two-factor/verify', auth, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, error: 'Verification code is required' });
    }
    
    const user = await User.findById(req.user.id).select('+twoFactorTempSecret');
    
    if (!user.twoFactorTempSecret) {
      return res.status(400).json({ success: false, error: 'Two-factor authentication not set up' });
    }
    
    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorTempSecret,
      encoding: 'base32',
      token: code
    });
    
    if (!verified) {
      return res.status(400).json({ success: false, error: 'Invalid verification code' });
    }
    
    // Enable 2FA
    user.twoFactorSecret = user.twoFactorTempSecret;
    user.twoFactorTempSecret = undefined;
    user.isTwoFactorEnabled = true;
    await user.save();
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Disable 2FA
// @route   POST /api/auth/two-factor/disable
router.post('/two-factor/disable', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.twoFactorSecret = undefined;
    user.isTwoFactorEnabled = false;
    await user.save();
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @desc    Validate 2FA during login
// @route   POST /api/auth/two-factor/validate
router.post('/two-factor/validate', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and code are required' });
    }
    
    // Find user
    const user = await User.findOne({ email }).select('+twoFactorSecret');
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    if (!user.isTwoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ success: false, error: 'Two-factor authentication not enabled' });
    }
    
    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1 // Allow 30 seconds before/after
    });
    
    if (!verified) {
      return res.status(401).json({ success: false, error: 'Invalid verification code' });
    }
    
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
