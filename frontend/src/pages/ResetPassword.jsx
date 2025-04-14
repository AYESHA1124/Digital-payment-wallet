import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, useToast } from '@chakra-ui/react'
import auth from '../services/auth'

export default function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setIsLoading(true)
    try {
      await auth.resetPassword(token, password)
      toast({
        title: 'Password reset successful',
        description: 'You can now login with your new password',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Password reset failed',
        description: error.response?.data?.message || 'Invalid or expired reset token',
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
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!errors.password}
          />
          {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
        </FormControl>
        <FormControl mb={6}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            isInvalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>}
        </FormControl>
        <Button 
          type="submit" 
          colorScheme="blue" 
          width="full" 
          mb={4}
          isLoading={isLoading}
          loadingText="Resetting..."
        >
          Reset Password
        </Button>
      </form>
    </Box>
  )
}
