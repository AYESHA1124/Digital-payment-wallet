import { Navigate } from 'react-router-dom'
import auth from '../services/auth'
import { useToast } from '@chakra-ui/react'

export default function VerifiedOnly({ children }) {
  const user = auth.getCurrentUser()
  const toast = useToast()

  if (!user?.emailVerified) {
    toast({
      title: 'Email verification required',
      description: 'Please verify your email to access this feature',
      status: 'warning',
      duration: 5000,
      isClosable: true
    })
    return <Navigate to="/dashboard" replace />
  }

  return children
}
