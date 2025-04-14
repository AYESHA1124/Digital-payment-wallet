import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import VerificationBanner from './VerificationBanner'
import { Flex, Spinner, Box, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth()
  
  if (loading) {
    return (
      <Flex justify="center" align="center" height="calc(100vh - 64px)" direction="column">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="brand.500" />
        <Box mt={4}>Loading authentication data...</Box>
      </Flex>
    )
  }
  
  if (!isAuthenticated || !user) {
    console.log('Protected route accessed without authentication. Redirecting to login.');
    return <Navigate to="/login" replace />
  }

  return (
    <>
      {user && !user.isVerified && <VerificationBanner />}
      {children}
    </>
  )
}

export default ProtectedRoute
