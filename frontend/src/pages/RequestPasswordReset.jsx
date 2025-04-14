import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, useToast } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import auth from '../services/auth'

export default function RequestPasswordReset() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await auth.requestPasswordReset(email)
      setSuccess(true)
      toast({
        title: 'Reset link sent',
        description: 'Check your email for password reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send reset link',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg">
      <Heading mb={6} textAlign="center">Reset Password</Heading>
      
      {success ? (
        <Text mb={4} textAlign="center">
          Password reset link sent to your email. Please check your inbox.
        </Text>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full" 
            mb={4}
            isLoading={isLoading}
            loadingText="Sending..."
          >
            Send Reset Link
          </Button>
        </form>
      )}
      
      <Box textAlign="center">
        Remember your password?{' '}
        <Link to="/login" style={{ color: 'blue' }}>Login here</Link>
      </Box>
    </Box>
  )
}
