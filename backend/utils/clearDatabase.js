require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Process command-line arguments
const args = process.argv.slice(2);
const clearUsers = args.includes('--users') || args.includes('-u') || args.length === 0;
const clearTransactions = args.includes('--transactions') || args.includes('-t') || args.length === 0;
const keepAdmin = args.includes('--keep-admin') || args.includes('-a');
const verbose = args.includes('--verbose') || args.includes('-v');

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB to clear data...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let transactionResult = { deletedCount: 0 };
    let userResult = { deletedCount: 0 };

    // Clear transactions
    if (clearTransactions) {
      console.log('Removing transactions...');
      transactionResult = await Transaction.deleteMany({});
      console.log(`Deleted ${transactionResult.deletedCount} transactions`);
    } else {
      console.log('Skipping transaction deletion (use --transactions or -t to include)');
    }

    // Clear users
    if (clearUsers) {
      console.log('Removing users...');
      
      // Query to delete users
      const deleteQuery = keepAdmin 
        ? { email: { $ne: 'admin@example.com' } } // Keep admin account if requested
        : {};
      
      userResult = await User.deleteMany(deleteQuery);
      
      if (keepAdmin) {
        console.log(`Deleted ${userResult.deletedCount} non-admin users (admin account preserved)`);
      } else {
        console.log(`Deleted ${userResult.deletedCount} users (including admin accounts)`);
      }
    } else {
      console.log('Skipping user deletion (use --users or -u to include)');
    }

    // Summary
    const totalRemoved = transactionResult.deletedCount + userResult.deletedCount;
    console.log(`\nDatabase cleanup complete. Removed ${totalRemoved} documents in total.`);
    
    if (verbose) {
      console.log('\nRemaining data summary:');
      const remainingUsers = await User.countDocuments();
      const remainingTransactions = await Transaction.countDocuments();
      console.log(`- Users: ${remainingUsers}`);
      console.log(`- Transactions: ${remainingTransactions}`);
    }
    
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

console.log('=== Digital Wallet Database Cleanup ===');
console.log('Starting database cleanup with the following options:');
console.log(`- Clear users: ${clearUsers ? 'Yes' : 'No'}`);
console.log(`- Clear transactions: ${clearTransactions ? 'Yes' : 'No'}`);
console.log(`- Keep admin accounts: ${keepAdmin ? 'Yes' : 'No'}`);
console.log(`- Verbose mode: ${verbose ? 'Yes' : 'No'}`);
console.log('=========================================');

// Run the cleanup
clearDatabase(); 