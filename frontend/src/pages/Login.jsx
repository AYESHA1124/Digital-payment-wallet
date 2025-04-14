import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  Text, 
  Link, 
  useToast, 
  Alert, 
  AlertIcon,
  VStack,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
  useColorModeValue,
  PinInput,
  PinInputField,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon, LockIcon, EmailIcon } from '@chakra-ui/icons'
import { FaSignInAlt, FaShieldAlt } from 'react-icons/fa'
import Card from '../components/Card'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationNeeded, setVerificationNeeded] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const navigate = useNavigate()
  const toast = useToast()
  const location = useLocation()
  const { login } = useAuth()
  
  // Theme colors
  const buttonBg = useColorModeValue('brand.500', 'brand.600')
  const headingColor = useColorModeValue('gray.700', 'white')
  const labelColor = useColorModeValue('gray.700', 'gray.300')
  const linkColor = useColorModeValue('brand.600', 'brand.400')
  const inputBg = useColorModeValue('white', 'gray.700')
  const modalBg = useColorModeValue('white', 'gray.800')
  
  // Check for verified query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      toast({
        title: 'Email verified successfully',
        description: 'You can now log in to your account',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  }, [location, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (error) {
      if (error.response?.data?.twoFactorRequired) {
        setTwoFactorRequired(true)
      } else if (error.response?.data?.verificationRequired) {
        setVerificationNeeded(true)
      } else {
        toast({
          title: 'Login failed',
          description: error.response?.data?.error || 'Invalid credentials',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleTwoFactorSubmit = async () => {
    if (twoFactorCode.length !== 6) return;
    
    setIsLoading(true);
    try {
      await auth.validateTwoFactor(email, twoFactorCode);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: 'Invalid verification code',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendVerification = async () => {
    try {
      await auth.resendVerification(email)
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox for the verification link',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Failed to send verification email',
        description: error.response?.data?.error || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <>
      <Flex justify="center" align="center">
        <Card maxW="md" mx="auto" mt={10} p={8} w="full">
          <VStack spacing={6} align="stretch">
            <Heading textAlign="center" color={headingColor} mb={2}>
              Login to Your Account
            </Heading>

            {verificationNeeded && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box flex="1">
                  <Text>Please verify your email before logging in</Text>
                  <Button 
                    size="sm" 
                    variant="link"
                    onClick={handleResendVerification}
                    colorScheme="blue"
                    mt={1}
                  >
                    Resend verification email
                  </Button>
                </Box>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel color={labelColor}>Email</FormLabel>
                  <InputGroup>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      bg={inputBg}
                    />
                    <InputRightElement>
                      <EmailIcon color="gray.500" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel color={labelColor}>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      bg={inputBg}
                    />
                    <InputRightElement>
                      <Icon
                        as={showPassword ? ViewOffIcon : ViewIcon}
                        cursor="pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        color="gray.500"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  leftIcon={<FaSignInAlt />}
                  colorScheme="brand"
                  bg={buttonBg}
                  width="full"
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Signing in"
                  mt={4}
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Box textAlign="center">
              <Text>
                Don't have an account?{' '}
                <Link as={RouterLink} to="/register" color={linkColor}>
                  Register
                </Link>
              </Text>
              <Text mt={2}>
                <Link as={RouterLink} to="/forgot-password" color={linkColor}>
                  Forgot password?
                </Link>
              </Text>
            </Box>
            
            <Flex justify="center" mt={4}>
              <Text fontSize="sm" textAlign="center" color="gray.500">
                By signing in, you agree to our{' '}
                <Link color={linkColor}>Terms of Service</Link> and{' '}
                <Link color={linkColor}>Privacy Policy</Link>
              </Text>
            </Flex>
          </VStack>
        </Card>
      </Flex>

      {/* Two-Factor Authentication Modal */}
      <Modal isOpen={twoFactorRequired} onClose={() => setTwoFactorRequired(false)} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader color={headingColor}>Two-Factor Authentication</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Flex align="center" mb={2}>
                <Icon as={FaShieldAlt} mr={2} color="blue.500" />
                <Text color={labelColor}>
                  Enter the 6-digit code from your authenticator app
                </Text>
              </Flex>
              
              <HStack justify="center">
                <PinInput otp value={twoFactorCode} onChange={setTwoFactorCode}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              
              <Button
                colorScheme="blue"
                width="full"
                mt={4}
                onClick={handleTwoFactorSubmit}
                isLoading={isLoading}
                isDisabled={twoFactorCode.length !== 6}
              >
                Verify
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
