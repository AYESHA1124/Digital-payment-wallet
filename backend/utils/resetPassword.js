require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const resetPassword = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find demo user
    const email = 'demo@example.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Demo user not found');
      return;
    }
    
    // Set new password directly (the pre-save hook will hash it)
    user.password = 'password123';
    await user.save();
    
    console.log(`Password reset successfully for ${email}`);
    console.log('You can now log in with:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the reset
resetPassword(); 