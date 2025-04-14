import { useState } from 'react'
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  Select, 
  useToast, 
  VStack,
  Text,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  useColorModeValue,
  Textarea,
  Flex,
  Icon,
  Spinner
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FaPaperPlane, FaUser, FaMoneyBillWave, FaFlag } from 'react-icons/fa'
import * as walletService from '../services/wallet'
import Card from '../components/Card'

export default function SendMoney() {
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    currency: 'USD',
    note: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  // Theme-aware colors
  const headingColor = useColorModeValue('gray.700', 'white')
  const labelColor = useColorModeValue('gray.600', 'gray.400')
  const inputBg = useColorModeValue('white', 'gray.700')
  const successButtonColor = useColorModeValue('green.500', 'green.400')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.recipient) {
      toast({
        title: 'Recipient required',
        description: 'Please enter a valid email address',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return false
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount greater than 0',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      await walletService.sendMoney(
        formData.recipient,
        parseFloat(formData.amount),
        formData.note
      )
      toast({
        title: 'Money sent successfully',
        description: `$${parseFloat(formData.amount).toFixed(2)} was sent to ${formData.recipient}`,
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      navigate('/wallet')
    } catch (error) {
      toast({
        title: 'Error sending money',
        description: error.response?.data?.error || error.message || 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box>
      <Heading mb={6} size="lg" color={headingColor}>
        Send Money
      </Heading>
      
      <Card maxW="xl" mx="auto">
        <VStack spacing={5} as="form" onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel color={labelColor}>
              <Flex align="center">
                <Icon as={FaUser} mr={2} />
                Recipient Email
              </Flex>
            </FormLabel>
            <Input
              type="email"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="Enter email address"
              bg={inputBg}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={labelColor}>
              <Flex align="center">
                <Icon as={FaMoneyBillWave} mr={2} />
                Amount
              </Flex>
            </FormLabel>
            <InputGroup>
              <InputLeftAddon children={formData.currency} />
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                placeholder="0.00"
                bg={inputBg}
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel color={labelColor}>Currency</FormLabel>
            <Select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              bg={inputBg}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel color={labelColor}>
              <Flex align="center">
                <Icon as={FaFlag} mr={2} />
                Note (Optional)
              </Flex>
            </FormLabel>
            <Textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add a note for the recipient"
              bg={inputBg}
              rows={3}
            />
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="green" 
            size="lg"
            width="full"
            mt={3}
            leftIcon={<FaPaperPlane />}
            isLoading={isSubmitting}
            loadingText="Sending..."
          >
            Send Money
          </Button>
          
          <Text fontSize="sm" color={labelColor}>
            Transactions are processed immediately and cannot be cancelled.
          </Text>
        </VStack>
      </Card>
    </Box>
  )
}
