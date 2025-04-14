import { api } from './api';

// Get wallet balance
export const getBalance = async () => {
  try {
    const response = await api.get('/wallet/balance');
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    // Return a default balance to prevent UI errors
    return { balance: 0 };
  }
};

// Send money to another user
export const sendMoney = async (receiverEmail, amount, description) => {
  const response = await api.post('/wallet/send', {
    receiverEmail,
    amount,
    description
  });
  return response.data;
};

// Get user's transaction history
export const getTransactions = async () => {
  try {
    const response = await api.get('/wallet/transactions');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    // Return empty array to prevent UI errors
    return [];
  }
};

export default {
  getBalance,
  sendMoney,
  getTransactions
};
