import { ChakraProvider, Container, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Wallet from './pages/Wallet'
import SendMoney from './pages/SendMoney'
import Transactions from './pages/Transactions'
import Profile from './pages/Profile'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'
import RequestPasswordReset from './pages/RequestPasswordReset'
import TwoFactorSetup from './pages/TwoFactorSetup'
import Debug from './pages/Debug'
import ProtectedRoute from './components/ProtectedRoute'
import theme from './theme'
import AuthProvider from './contexts/AuthContext'
import { NotificationProvider } from './components/NotificationSystem'

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Navbar />
              <Container maxW="container.xl" py={5}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email/:token" element={<VerifyEmail />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/forgot-password" element={<RequestPasswordReset />} />
                  <Route path="/debug" element={<Debug />} />
                  
                  <Route path="/wallet" element={
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/send-money" element={
                    <ProtectedRoute>
                      <SendMoney />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/transactions" element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/two-factor-setup" element={
                    <ProtectedRoute>
                      <TwoFactorSetup />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Container>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ChakraProvider>
    </>
  )
}

export default App
