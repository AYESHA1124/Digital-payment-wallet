const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function seedDemoAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@example.com' });
    
    if (existingUser) {
      console.log('Demo account already exists');
      return existingUser;
    }

    // Create demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      walletBalance: 5000,
      isVerified: true
    });

    console.log('Demo account created successfully');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
    console.log('Current balance: $5000');

    // Create some sample transactions
    const demoUser2 = await User.findOne({ email: 'contact@example.com' }) || 
      await User.create({
        name: 'Contact User',
        email: 'contact@example.com',
        password: 'password123',
        walletBalance: 3000,
        isVerified: true
      });

    // Create sample transactions
    await Transaction.create([
      {
        sender: demoUser._id,
        receiver: demoUser2._id,
        amount: 100,
        description: 'Lunch payment',
        status: 'completed',
        paymentMethod: 'wallet',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        sender: demoUser2._id,
        receiver: demoUser._id,
        amount: 250,
        description: 'Concert tickets',
        status: 'completed',
        paymentMethod: 'wallet',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        sender: demoUser._id,
        receiver: demoUser2._id,
        amount: 75,
        description: 'Shared taxi',
        status: 'completed',
        paymentMethod: 'wallet',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]);

    console.log('Demo transactions created successfully');
    return demoUser;
  } catch (error) {
    console.error('Error seeding demo account:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function if script is executed directly
if (require.main === module) {
  seedDemoAccount()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedDemoAccount; 