import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Heading, Text, Button, useToast } from '@chakra-ui/react'
import auth from '../services/auth'

export default function VerifyEmail() {
  const { token } = useParams()
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await auth.verifyEmail(token)
        setIsVerified(true)
        toast({
          title: 'Email verified successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      } catch (error) {
        toast({
          title: 'Verification failed',
          description: error.response?.data?.message || 'Invalid or expired verification token',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token, toast])

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6} textAlign="center">
        Email Verification
      </Heading>
      {isLoading ? (
        <Text textAlign="center">Verifying your email...</Text>
      ) : isVerified ? (
        <>
          <Text mb={4} textAlign="center">
            Your email has been successfully verified!
          </Text>
          <Button
            colorScheme="blue"
            width="full"
            onClick={() => navigate('/login')}
          >
            Continue to Login
          </Button>
        </>
      ) : (
        <Text textAlign="center">
          Verification failed. Please try again or request a new verification link.
        </Text>
      )}
    </Box>
  )
}
