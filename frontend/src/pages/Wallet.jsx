import { 
  Box, 
  Heading, 
  Button, 
  Stat, 
  StatLabel, 
  StatNumber, 
  Spinner, 
  Text, 
  Flex, 
  HStack,
  VStack,
  Divider,
  useColorModeValue,
  SimpleGrid,
  Icon,
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
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tooltip,
  Badge,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowUpIcon, ArrowDownIcon, RepeatIcon, CalendarIcon, CopyIcon } from '@chakra-ui/icons'
import { FaWallet, FaHistory, FaPaperPlane, FaCreditCard, FaQrcode, FaClock, FaUsers, FaMobile, FaBell } from 'react-icons/fa'
import * as walletService from '../services/wallet'
import Card from '../components/Card'
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';

// Mock scheduled payments
const mockScheduledPayments = [
  { id: 1, recipient: 'Electricity Company', amount: 85.75, date: '2023-07-02', recurring: 'Monthly' },
  { id: 2, recipient: 'Internet Provider', amount: 59.99, date: '2023-07-05', recurring: 'Monthly' },
  { id: 3, recipient: 'Subscription Service', amount: 12.99, date: '2023-07-10', recurring: 'Monthly' }
];

export default function Wallet() {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qrValue, setQrValue] = useState('');
  const [qrAmount, setQrAmount] = useState('');
  const [showNfcAnimation, setShowNfcAnimation] = useState(false);
  const [scheduledPayments, setScheduledPayments] = useState(mockScheduledPayments);
  
  const { user } = useAuth();
  const currency = 'USD';
  
  // Modal controls
  const { 
    isOpen: isReceiveOpen, 
    onOpen: onReceiveOpen, 
    onClose: onReceiveClose 
  } = useDisclosure();
  
  const { 
    isOpen: isScheduleOpen, 
    onOpen: onScheduleOpen, 
    onClose: onScheduleClose 
  } = useDisclosure();
  
  const { 
    isOpen: isContactlessOpen, 
    onOpen: onContactlessOpen, 
    onClose: onContactlessClose 
  } = useDisclosure();

  // Theme-aware colors
  const headingColor = useColorModeValue('gray.700', 'white')
  const statLabelColor = useColorModeValue('gray.600', 'gray.300')
  const balanceColor = useColorModeValue('brand.600', 'brand.400')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  const cardBg = useColorModeValue('white', 'gray.700')
  const modalBg = useColorModeValue('white', 'gray.800')
  const qrBg = useColorModeValue('white', 'gray.700')

  useEffect(() => {
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
  }, [])

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

  // Simulate NFC payment
  const simulateNfcPayment = () => {
    setShowNfcAnimation(true);
    setTimeout(() => {
      setShowNfcAnimation(false);
      onContactlessClose();
      alert('Payment successful!');
    }, 3000);
  };

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
                leftIcon={<FaClock />}
                colorScheme="purple"
                onClick={onScheduleOpen}
              >
                Schedule
              </Button>
              <Button
                leftIcon={<FaMobile />}
                colorScheme="orange"
                onClick={onContactlessOpen}
              >
                Tap to Pay
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
            <Text color={statLabelColor}>No scheduled payments</Text>
          )}
          <Button mt={4} leftIcon={<FaClock />} colorScheme="purple" variant="outline" onClick={onScheduleOpen}>
            Schedule Payment
          </Button>
        </Card>

        <Card>
          <Heading size="md" mb={4} color={headingColor}>
            Payment Methods
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4}>
            <Box p={4} borderWidth="1px" borderRadius="md" borderColor={useColorModeValue('gray.200', 'gray.600')}>
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Icon as={FaWallet} mr={3} color={accentColor} />
                  <Box>
                    <Text fontWeight="bold">Wallet Balance</Text>
                    <Text fontSize="sm" color={statLabelColor}>Primary payment method</Text>
                  </Box>
                </Flex>
                <Badge colorScheme="green">Active</Badge>
              </Flex>
            </Box>
            <Box p={4} borderWidth="1px" borderRadius="md" borderColor={useColorModeValue('gray.200', 'gray.600')} opacity={0.7}>
              <Flex align="center" justify="space-between">
                <Flex align="center">
                  <Icon as={FaCreditCard} mr={3} color={statLabelColor} />
                  <Box>
                    <Text fontWeight="bold">Virtual Card</Text>
                    <Text fontSize="sm" color={statLabelColor}>****-****-****-4321</Text>
                  </Box>
                </Flex>
                <Badge colorScheme="blue">Linked</Badge>
              </Flex>
            </Box>
            <Button 
              mt={2} 
              leftIcon={<FaCreditCard />}
              variant="outline"
              w="full"
            >
              Add Payment Method
            </Button>
          </SimpleGrid>
        </Card>
      </SimpleGrid>

      {/* Receive Payment Modal */}
      <Modal isOpen={isReceiveOpen} onClose={onReceiveClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader color={headingColor}>Receive Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
              <TabList mb={4}>
                <Tab>QR Code</Tab>
                <Tab>Payment Link</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel color={statLabelColor}>Amount (optional)</FormLabel>
                      <InputGroup>
                        <InputLeftAddon children={currency} />
                        <Input 
                          type="number" 
                          value={qrAmount} 
                          onChange={(e) => setQrAmount(e.target.value)}
                          placeholder="Enter amount"
                        />
                      </InputGroup>
                    </FormControl>
                    <Box 
                      p={4} 
                      bg={qrBg} 
                      borderRadius="md" 
                      borderWidth="1px" 
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      alignSelf="center"
                    >
                      <QRCodeSVG 
                        value={qrValue}
                        size={200}
                        bgColor={useColorModeValue('#FFFFFF', '#2D3748')}
                        fgColor={useColorModeValue('#000000', '#FFFFFF')}
                        level="L"
                        includeMargin={false}
                      />
                    </Box>
                    <Text fontSize="sm" color={statLabelColor} textAlign="center">
                      Scan this QR code to send money to your wallet
                    </Text>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel color={statLabelColor}>Amount (optional)</FormLabel>
                      <InputGroup>
                        <InputLeftAddon children={currency} />
                        <Input 
                          type="number" 
                          value={qrAmount} 
                          onChange={(e) => setQrAmount(e.target.value)}
                          placeholder="Enter amount"
                        />
                      </InputGroup>
                    </FormControl>
                    <Box 
                      p={3} 
                      borderWidth="1px" 
                      borderRadius="md" 
                      borderColor={useColorModeValue('gray.200', 'gray.600')}
                      w="full"
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" fontFamily="monospace" isTruncated>
                          https://digital-wallet.example/pay/{user?.email}
                          {qrAmount ? `?amount=${qrAmount}` : ''}
                        </Text>
                        <Tooltip label="Copy link">
                          <Button size="sm" onClick={handleCopyLink} variant="ghost">
                            <CopyIcon />
                          </Button>
                        </Tooltip>
                      </Flex>
                    </Box>
                    <Text fontSize="sm" color={statLabelColor} textAlign="center">
                      Share this link for others to send you money
                    </Text>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onReceiveClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Schedule Payment Modal */}
      <Modal isOpen={isScheduleOpen} onClose={onScheduleClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader color={headingColor}>Schedule Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color={statLabelColor}>Recipient</FormLabel>
                <Input placeholder="Email or username" />
              </FormControl>
              <FormControl>
                <FormLabel color={statLabelColor}>Amount</FormLabel>
                <InputGroup>
                  <InputLeftAddon children={currency} />
                  <NumberInput min={1} w="full">
                    <NumberInputField placeholder="Enter amount" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel color={statLabelColor}>Payment Date</FormLabel>
                <Input type="date" />
              </FormControl>
              <FormControl>
                <FormLabel color={statLabelColor}>Recurring</FormLabel>
                <Select>
                  <option value="one-time">One-time payment</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color={statLabelColor}>Note (optional)</FormLabel>
                <Input placeholder="Add a note" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onScheduleClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" leftIcon={<FaClock />}>
              Schedule Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Contactless Payment Modal */}
      <Modal isOpen={isContactlessOpen} onClose={onContactlessClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader color={headingColor}>Tap to Pay</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} py={4}>
              {showNfcAnimation ? (
                <Flex 
                  direction="column" 
                  align="center" 
                  justify="center" 
                  h="200px"
                >
                  <Spinner size="xl" thickness="4px" speed="0.65s" color="green.500" />
                  <Text mt={4} fontSize="lg" fontWeight="medium">
                    Processing payment...
                  </Text>
                </Flex>
              ) : (
                <>
                  <Box 
                    borderWidth="2px" 
                    borderRadius="md" 
                    borderColor="blue.500" 
                    p={8} 
                    borderStyle="dashed"
                  >
                    <Icon as={FaMobile} boxSize={16} color="blue.500" />
                  </Box>
                  <Text fontSize="lg" fontWeight="medium" textAlign="center">
                    Hold your phone near the payment terminal
                  </Text>
                  <Text color={statLabelColor} textAlign="center">
                    Uses your primary payment method
                  </Text>
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="outline" 
              mr={3} 
              onClick={onContactlessClose}
              isDisabled={showNfcAnimation}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<FaMobile />}
              onClick={simulateNfcPayment}
              isDisabled={showNfcAnimation}
            >
              Simulate Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
