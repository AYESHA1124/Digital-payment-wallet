require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Reset the entire database and create a fresh demo account
const resetDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Clear all data
    console.log('\n--- CLEARING EXISTING DATA ---');
    
    // Remove all transactions
    console.log('Removing all transactions...');
    const transactionsDeleted = await Transaction.deleteMany({});
    console.log(`Deleted ${transactionsDeleted.deletedCount} transactions`);
    
    // Remove all users
    console.log('Removing all users...');
    const usersDeleted = await User.deleteMany({});
    console.log(`Deleted ${usersDeleted.deletedCount} users`);
    
    console.log('\n--- CREATING DEMO ACCOUNT ---');
    
    // 2. Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      isVerified: true,
      walletBalance: 5000
    });
    
    await demoUser.save();
    console.log('Demo account created:');
    console.log(`- Name: ${demoUser.name}`);
    console.log(`- Email: demo@example.com`);
    console.log(`- Password: password123`);
    console.log(`- Balance: $5000`);
    
    // 3. Create some demo transactions
    console.log('\n--- CREATING DEMO TRANSACTIONS ---');
    
    // Create sample transactions
    const transactions = [
      {
        sender: demoUser._id,
        receiver: demoUser._id,
        amount: 1000,
        description: 'Initial deposit',
        status: 'completed',
        paymentMethod: 'bank',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        sender: demoUser._id,
        receiver: demoUser._id,
        amount: 250,
        description: 'Grocery shopping',
        status: 'completed',
        paymentMethod: 'wallet',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        sender: demoUser._id,
        receiver: demoUser._id,
        amount: 75,
        description: 'Electricity bill',
        status: 'completed',
        paymentMethod: 'wallet',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        sender: demoUser._id,
        receiver: demoUser._id,
        amount: 120,
        description: 'Restaurant dinner',
        status: 'completed',
        paymentMethod: 'card',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];
    
    await Transaction.insertMany(transactions);
    console.log(`Created ${transactions.length} demo transactions`);
    
    console.log('\n--- DATABASE RESET COMPLETE ---');
    console.log('The database has been reset with a fresh demo account and transactions.');
    console.log('You can now log in with:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

console.log('=== DIGITAL WALLET DATABASE RESET ===');
console.log('This will completely reset the database, removing ALL users and transactions,');
console.log('and create a fresh demo account with sample transactions.');
console.log('=========================================');

// Run the reset
resetDatabase(); 