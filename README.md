# Digital Wallet Application

<p align="center">
  <img src="frontend/public/logo.svg" alt="Digital Wallet Logo" width="200" height="200">
</p>

A modern, full-stack digital wallet application for secure money transfers, transaction tracking, and financial management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Authentication**
  - Registration and login
  - Email verification
  - Two-factor authentication
  - Password reset functionality

- **Wallet Management**
  - View wallet balance
  - Add money to wallet
  - Send and receive money
  - QR code for receiving payments

- **Transaction Features**
  - Transaction history with filtering and sorting
  - Scheduled payments
  - Payment categories and analytics

- **Security Features**
  - JWT authentication
  - Encryption for sensitive data
  - Rate limiting to prevent brute force attacks
  - CORS protection

- **User Experience**
  - Responsive design for mobile and desktop
  - Dark/light mode support
  - Real-time notifications

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Chakra UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Nodemailer** - Email service

## 📁 Project Structure

```
digital-wallet/
├── frontend/                 # React frontend application
│   ├── public/               # Static files
│   │   ├── logo.svg          # Logo
│   │   └── logo-small.svg    # Small logo for navbar
│   ├── src/                  # Source files
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Auth, etc.)
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── .env                  # Frontend environment variables
│   └── vite.config.js        # Vite configuration
│
├── backend/                  # Node.js backend application
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   │   ├── auth.js           # Authentication routes
│   │   └── wallet.js         # Wallet operations routes
│   ├── utils/                # Utility functions
│   ├── .env                  # Backend environment variables
│   └── server.js             # Entry point
│
└── README.md                 # Project documentation
```

## 🚀 Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/digital-wallet.git
cd digital-wallet
```

2. **Backend Setup**

```bash
cd backend
npm install

# Create .env file (see Environment Variables section)
cp .env.example .env

# Start server
npm run dev
```

3. **Frontend Setup**

```bash
cd frontend
npm install

# Create .env file (see Environment Variables section)
cp .env.example .env

# Start development server
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)

```
# Server Configuration
PORT=8080

# Database
MONGODB_URI=mongodb://localhost:27017/digital-wallet

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d

# Email Service
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASSWORD=your_password
SMTP_FROM_EMAIL=noreply@digitalwallet.com

# Optional Payment Gateway
PAYMENT_GATEWAY_KEY=your_payment_gateway_key
```

### Frontend (.env)

```
# API Configuration
VITE_API_URL=http://localhost:8080/api

# Feature Flags
VITE_ENABLE_DEMO_MODE=true
VITE_ENABLE_UPI_PAYMENTS=true

# App Configuration
VITE_MAX_TRANSACTION_AMOUNT=10000
VITE_DEFAULT_CURRENCY=USD
```

## 📝 Usage

### User Workflow

1. **Registration & Login**
   - Register with email, password
   - Verify email through verification link
   - Login with credentials
   - Optional: Set up two-factor authentication

2. **Wallet Operations**
   - View your current balance
   - Add money to wallet through various payment methods
   - Send money to other users
   - Generate QR code for receiving money
   - Schedule payments

3. **Transaction Management**
   - View transaction history
   - Filter transactions by date, type, amount
   - View spending analytics

### Demo Account

For testing, use the following demo account:
- Email: demo@example.com
- Password: password123

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh authentication token
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Wallet Endpoints

- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/add-money` - Add money to wallet
- `POST /api/wallet/send` - Send money to another user
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/wallet/schedule-payment` - Schedule a payment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  Made with ❤️ by Your Team
</p> 