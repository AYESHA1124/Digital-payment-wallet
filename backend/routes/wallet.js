const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret'
});

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
router.get('/balance', auth, async (req, res) => {
  try {
    // In a real implementation, you would calculate balance from transactions
    // This is a simplified version
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    console.log(`Successfully retrieved balance for user: ${user.email}`);
    res.json({ balance: user.walletBalance || 0 });
  } catch (err) {
    console.error('Error fetching wallet balance:', err);
    res.status(500).json({ success: false, error: 'Server error fetching wallet balance' });
  }
});

// @desc    Send money
// @route   POST /api/wallet/send
router.post('/send', auth, async (req, res) => {
  try {
    const { receiverEmail, amount, description } = req.body;

    // Validate input
    if (!receiverEmail || !amount) {
      return res.status(400).json({ success: false, error: 'Recipient and amount are required' });
    }
    
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Amount must be a positive number' });
    }

    // Validate receiver
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
      return res.status(400).json({ success: false, error: 'Receiver not found' });
    }
    
    // Check sender has enough balance
    const sender = await User.findById(req.user.id);
    if (sender.walletBalance < amount) {
      return res.status(400).json({ success: false, error: 'Insufficient balance' });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      sender: req.user.id,
      receiver: receiver._id,
      amount,
      description,
      status: 'completed',
      paymentMethod: 'wallet'
    });

    // Update sender & receiver balances
    sender.walletBalance -= parseFloat(amount);
    receiver.walletBalance += parseFloat(amount);
    
    await sender.save();
    await receiver.save();

    console.log(`Money sent: ${amount} from ${sender.email} to ${receiver.email}`);
    res.json({ success: true, transaction });
  } catch (err) {
    console.error('Error sending money:', err);
    res.status(500).json({ success: false, error: 'Server error processing transaction' });
  }
});

// @desc    Get user transactions
// @route   GET /api/wallet/transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    // Find transactions where user is either sender or receiver
    const transactions = await Transaction.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 }); // Sort by newest first

    console.log(`Retrieved ${transactions.length} transactions for user: ${req.user.email}`);
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ success: false, error: 'Server error fetching transactions' });
  }
});

module.exports = router;
