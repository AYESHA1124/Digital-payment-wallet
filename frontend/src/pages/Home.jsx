import { 
  Box, 
  Button, 
  Heading, 
  Text, 
  Flex, 
  Stack, 
  VStack, 
  HStack, 
  Grid, 
  GridItem, 
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Icon,
  useDisclosure,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  InputGroup,
  InputLeftElement,
  useToast
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import * as walletService from '../services/wallet'
import { ArrowUpIcon, ArrowDownIcon, RepeatIcon, CalendarIcon, CopyIcon, AddIcon } from '@chakra-ui/icons'
import { FaWallet, FaHistory, FaPaperPlane, FaCreditCard, FaQrcode, FaClock, FaUsers, FaMobile, FaBell, FaMoneyBillWave } from 'react-icons/fa'
import { QRCodeSVG } from 'qrcode.react'

// Mock scheduled payments
const mockScheduledPayments = [
  { id: 1, recipient: 'Electricity Company', amount: 85.75, date: '2023-07-02', recurring: 'Monthly' },
  { id: 2, recipient: 'Internet Provider', amount: 59.99, date: '2023-07-05', recurring: 'Monthly' },
  { id: 3, recipient: 'Subscription Service', amount: 12.99, date: '2023-07-10', recurring: 'Monthly' }
];

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scheduledPayments, setScheduledPayments] = useState(mockScheduledPayments)
  const [qrValue, setQrValue] = useState('')
  const [qrAmount, setQrAmount] = useState('')
  const [addMoneyAmount, setAddMoneyAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isAddingMoney, setIsAddingMoney] = useState(false)
  
  const toast = useToast()
  const bg = useColorModeValue('blue.50', 'blue.900')
  const headingColor = useColorModeValue('gray.700', 'white')
  const statLabelColor = useColorModeValue('gray.600', 'gray.300')
  const balanceColor = useColorModeValue('brand.600', 'brand.400')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  const cardBg = useColorModeValue('white', 'gray.700')
  const currency = 'USD'
  
  // Modal controls
  const { 
    isOpen: isReceiveOpen, 
    onOpen: onReceiveOpen, 
    onClose: onReceiveClose 
  } = useDisclosure()
  
  const {
    isOpen: isAddMoneyOpen,
    onOpen: onAddMoneyOpen,
    onClose: onAddMoneyClose
  } = useDisclosure()

  useEffect(() => {
    // Only fetch wallet data if user is authenticated
    if (isAuthenticated) {
      setLoading(true)
      const fetchBalance = async () => {
        try {
          const data = await walletService.getBalance()
          setBalance(data.balance)
        } catch (err) {
          setError(err.message || 'Failed to fetch wallet balance')
        } finally {
          setLoading(false)
        }
      }
      fetchBalance()
    }
  }, [isAuthenticated])
  
  // Generate QR code value when amount changes
  useEffect(() => {
    if (user && user.email) {
      const qrData = {
        email: user.email,
        amount: qrAmount || '',
        currency: currency,
        timestamp: new Date().toISOString()
      };
      setQrValue(JSON.stringify(qrData));
    }
  }, [qrAmount, user, currency]);

  // Handle copy payment link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://digital-wallet.example/pay/${user.email}?amount=${qrAmount}&currency=${currency}`);
    alert('Payment link copied to clipboard!');
  };
  
  // GUEST VIEW - Show when user is not logged in
  if (!isAuthenticated) {
    return (
      <Box>
        {/* Hero Section */}
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          py={16} 
          px={4} 
          bg={bg} 
          borderRadius="lg"
          mb={10}
        >
          <Heading as="h1" size="2xl" textAlign="center" mb={6}>
            Digital Wallet
          </Heading>
          <Text fontSize="xl" textAlign="center" maxW="800px" mb={10}>
            A secure and easy way to manage your digital payments. Send money, track transactions, and manage your finances all in one place.
          </Text>
          <HStack spacing={6}>
            <Button as={Link} to="/login" colorScheme="blue" size="lg">
              Login
            </Button>
            <Button as={Link} to="/register" colorScheme="green" size="lg">
              Register
            </Button>
          </HStack>
        </Flex>

        {/* Demo Account Info */}
        <Box p={8} borderWidth="1px" borderRadius="lg" mb={10}>
          <Heading size="lg" mb={4}>Try Our Demo Account</Heading>
          <Text mb={4}>
            Want to explore without signing up? Use our demo account to access all features:
          </Text>
          <VStack align="start" bg="gray.50" p={4} borderRadius="md" spacing={2}>
            <Text><strong>Email:</strong> demo@example.com</Text>
            <Text><strong>Password:</strong> password123</Text>
          </VStack>
        </Box>

        {/* Features Section */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} mb={16}>
          <GridItem p={6} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Send Money</Heading>
            <Text>
              Transfer funds instantly to any registered user. Quick, secure, and with minimal fees.
            </Text>
          </GridItem>
          <GridItem p={6} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Track Transactions</Heading>
            <Text>
              Monitor all your financial activities with detailed transaction history and reports.
            </Text>
          </GridItem>
          <GridItem p={6} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Secure Wallet</Heading>
            <Text>
              Industry-standard security protocols protect your funds and personal information.
            </Text>
          </GridItem>
        </Grid>
      </Box>
    )
  }
  
  // WALLET VIEW - Show when user is logged in
  if (loading) {
    return (
      <Flex height="50vh" align="center" justify="center">
        <Spinner size="xl" color={accentColor} thickness="4px" />
      </Flex>
    )
  }
  
  if (error) {
    return (
      <Card>
        <Text color="red.500" fontSize="lg" textAlign="center">
          {error}
        </Text>
      </Card>
    )
  }
  
  // Add money handler
  const handleAddMoney = () => {
    setIsAddingMoney(true)
    
    // Simulate adding money to the wallet
    setTimeout(() => {
      // Update the balance in a real app you would call an API
      if (balance !== null) {
        const newAmount = parseFloat(addMoneyAmount)
        setBalance(prevBalance => prevBalance + newAmount)
      }
      
      // Show success toast
      toast({
        title: 'Money Added Successfully',
        description: `Added ${currency} ${addMoneyAmount} to your wallet.`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      
      // Reset and close modal
      setAddMoneyAmount('')
      setIsAddingMoney(false)
      onAddMoneyClose()
    }, 1500)
  }

  return (
    <Box>
      <Heading mb={6} size="lg" color={headingColor}>
        My Wallet
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Card>
          <VStack align="start" spacing={4}>
            <Flex w="full" justify="space-between" align="center">
              <Stat>
                <StatLabel color={statLabelColor}>Current Balance</StatLabel>
                <StatNumber fontSize="3xl" color={balanceColor}>
                  {currency} {balance?.toFixed(2) || '0.00'}
                </StatNumber>
              </Stat>
              <Icon as={FaWallet} boxSize={12} color={accentColor} opacity={0.8} />
            </Flex>
            
            <Text fontSize="sm" color={statLabelColor}>
              Last updated: {new Date().toLocaleString()}
            </Text>
          </VStack>
        </Card>

        <Card>
          <VStack align="start" spacing={4}>
            <Heading size="md" color={headingColor}>Quick Actions</Heading>
            <HStack spacing={4} wrap="wrap">
              <Button 
                as={Link} 
                to="/send-money" 
                leftIcon={<ArrowUpIcon />} 
                colorScheme="green"
              >
                Send Money
              </Button>
              <Button 
                leftIcon={<FaQrcode />} 
                colorScheme="blue"
                onClick={onReceiveOpen}
              >
                Receive
              </Button>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="teal"
                onClick={onAddMoneyOpen}
              >
                Add Money
              </Button>
              <Button 
                as={Link}
                to="/transactions"
                leftIcon={<FaHistory />}
                colorScheme="purple"
              >
                History
              </Button>
            </HStack>
          </VStack>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
        <Card>
          <Heading size="md" mb={4} color={headingColor}>
            Scheduled Payments
          </Heading>
          {scheduledPayments.length > 0 ? (
            <VStack spacing={3} align="stretch">
              {scheduledPayments.map(payment => (
                <Box 
                  key={payment.id} 
                  p={3} 
                  borderWidth="1px" 
                  borderRadius="md" 
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="medium">{payment.recipient}</Text>
                      <Text fontSize="sm" color={statLabelColor}>
                        Due: {payment.date} • 
                        <Badge ml={1} colorScheme="purple">{payment.recurring}</Badge>
                      </Text>
                    </Box>
                    <Text fontWeight="bold">
                      {currency} {payment.amount.toFixed(2)}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color={statLabelColor}>No scheduled payments.</Text>
          )}
        </Card>
        
        <Card>
          <Heading size="md" mb={4} color={headingColor}>
            Payment Methods
          </Heading>
          <VStack spacing={4} align="stretch">
            <Flex p={3} borderWidth="1px" borderRadius="md" justify="space-between" align="center">
              <Flex align="center">
                <Icon as={FaWallet} mr={3} color={accentColor} />
                <Box>
                  <Text fontWeight="medium">Digital Wallet</Text>
                  <Text fontSize="sm" color={statLabelColor}>Primary</Text>
                </Box>
              </Flex>
              <Badge colorScheme="green">Active</Badge>
            </Flex>
            
            <Flex p={3} borderWidth="1px" borderRadius="md" justify="space-between" align="center">
              <Flex align="center">
                <Icon as={FaCreditCard} mr={3} color={statLabelColor} />
                <Box>
                  <Text fontWeight="medium">Add Payment Method</Text>
                  <Text fontSize="sm" color={statLabelColor}>Debit/Credit Card</Text>
                </Box>
              </Flex>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<FaCreditCard />}
                colorScheme="blue"
              >
                Add
              </Button>
            </Flex>
          </VStack>
        </Card>
      </SimpleGrid>
      
      {/* Add Money Modal */}
      <Modal isOpen={isAddMoneyOpen} onClose={onAddMoneyClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader>Add Money to Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <FormControl isRequired>
                <FormLabel>Enter Amount ({currency})</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color={statLabelColor}
                    fontSize="1.2em"
                    children="$"
                  />
                  <NumberInput
                    min={5}
                    max={10000}
                    precision={2}
                    value={addMoneyAmount}
                    onChange={value => setAddMoneyAmount(value)}
                    width="100%"
                  >
                    <NumberInputField pl="8" placeholder="Amount to add" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Payment Method</FormLabel>
                <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                  <VStack align="start" spacing={3}>
                    <Radio value="card">
                      <Flex align="center">
                        <Icon as={FaCreditCard} mr={2} color={accentColor} />
                        Credit/Debit Card
                      </Flex>
                    </Radio>
                    <Radio value="bank">
                      <Flex align="center">
                        <Icon as={FaMoneyBillWave} mr={2} color={accentColor} />
                        Bank Transfer
                      </Flex>
                    </Radio>
                    <Radio value="upi">
                      <Flex align="center">
                        <Icon as={FaMobile} mr={2} color={accentColor} />
                        UPI Payment
                      </Flex>
                    </Radio>
                  </VStack>
                </RadioGroup>
              </FormControl>
              
              {paymentMethod === 'card' && (
                <SimpleGrid columns={1} spacing={3}>
                  <FormControl isRequired>
                    <FormLabel>Card Number</FormLabel>
                    <Input placeholder="1234 5678 9012 3456" />
                  </FormControl>
                  <SimpleGrid columns={2} spacing={3}>
                    <FormControl isRequired>
                      <FormLabel>Expiry Date</FormLabel>
                      <Input placeholder="MM/YY" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>CVV</FormLabel>
                      <Input placeholder="123" type="password" maxLength={3} />
                    </FormControl>
                  </SimpleGrid>
                </SimpleGrid>
              )}
              
              {paymentMethod === 'bank' && (
                <Box p={4} borderWidth="1px" borderRadius="md" borderStyle="dashed">
                  <Text mb={2} fontWeight="medium">Bank Account Details:</Text>
                  <Text fontSize="sm">Account Number: XXXX-XXXX-XXXX</Text>
                  <Text fontSize="sm">IFSC Code: ABCD0001234</Text>
                  <Text fontSize="sm" mt={2} color={statLabelColor}>
                    *Bank transfers may take 1-2 business days to reflect in your wallet
                  </Text>
                </Box>
              )}
              
              {paymentMethod === 'upi' && (
                <FormControl isRequired>
                  <FormLabel>UPI ID</FormLabel>
                  <Input placeholder="name@upi" />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="teal" 
              mr={3} 
              onClick={handleAddMoney}
              isLoading={isAddingMoney}
              loadingText="Processing"
              isDisabled={!addMoneyAmount}
            >
              Add Money
            </Button>
            <Button variant="ghost" onClick={onAddMoneyClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Receive Money Modal */}
      <Modal isOpen={isReceiveOpen} onClose={onReceiveClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader>Receive Money</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="center">
              <FormControl>
                <FormLabel>Optional: Request Amount ({currency})</FormLabel>
                <Input 
                  value={qrAmount}
                  onChange={(e) => setQrAmount(e.target.value)}
                  placeholder="Enter amount"
                  type="number"
                />
              </FormControl>
              
              <Box 
                bg={useColorModeValue('white', 'gray.700')} 
                p={4} 
                borderRadius="md" 
                borderWidth="1px"
              >
                <QRCodeSVG 
                  value={qrValue} 
                  size={200} 
                  bgColor={useColorModeValue('#FFFFFF', '#2D3748')}
                  fgColor={useColorModeValue('#000000', '#FFFFFF')}
                />
              </Box>
              
              <Box w="full">
                <FormControl>
                  <FormLabel>Payment Link</FormLabel>
                  <Flex>
                    <Input 
                      value={`https://digital-wallet.example/pay/${user?.email}?amount=${qrAmount}&currency=${currency}`} 
                      isReadOnly
                      pr="4.5rem"
                    />
                    <Button size="sm" onClick={handleCopyLink} variant="ghost">
                      <CopyIcon />
                    </Button>
                  </Flex>
                </FormControl>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onReceiveClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
