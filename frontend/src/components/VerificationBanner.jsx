import { Box, Text, Button, useToast } from '@chakra-ui/react'
import auth from '../services/auth'

export default function VerificationBanner() {
  const toast = useToast()

  const handleResend = async () => {
    try {
      await auth.resendVerification()
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Failed to resend verification',
        description: error.response?.data?.message || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Box bg="yellow.100" p={4} mb={4} borderRadius="md">
      <Text fontWeight="bold" mb={2}>
        Your email is not verified
      </Text>
      <Text mb={3}>
        Please verify your email address to access all features. Check your inbox for the verification link.
      </Text>
      <Button 
        colorScheme="blue" 
        size="sm"
        onClick={handleResend}
      >
        Resend Verification Email
      </Button>
    </Box>
  )
}
