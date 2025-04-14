import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, useToast, useColorModeValue } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const [errors, setErrors] = useState({})
  const { register } = useAuth()
  
  // Theme-aware colors
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const headingColor = useColorModeValue('gray.700', 'white')
  const labelColor = useColorModeValue('gray.700', 'gray.300')
  
  const validate = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setIsLoading(true)
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      await register(userData)
      
      toast({
        title: 'Registration successful',
        description: 'Please login with your new account',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      navigate('/dashboard')
    } catch (error) {
      let errorMessage = 'An error occurred';
      
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Registration failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card maxW="md" mx="auto" mt={10} p={8}>
      <Heading mb={6} textAlign="center" color={headingColor}>Register</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel color={labelColor}>Full Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              bg={bgColor}
            />
            {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={labelColor}>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              bg={bgColor}
            />
            {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
        </FormControl>
        <FormControl mb={4}>
          <FormLabel color={labelColor}>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              bg={bgColor}
            />
            {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
        </FormControl>
        <FormControl mb={6}>
          <FormLabel color={labelColor}>Confirm Password</FormLabel>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmPassword}
              bg={bgColor}
            />
            {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>}
        </FormControl>
        <Button 
          type="submit" 
          colorScheme="brand" 
          width="full" 
          mb={4}
          isLoading={isLoading}
          loadingText="Registering..."
        >
          Register
        </Button>
        <Box textAlign="center">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'blue' }}>Login here</Link>
        </Box>
      </form>
    </Card>
  )
}
