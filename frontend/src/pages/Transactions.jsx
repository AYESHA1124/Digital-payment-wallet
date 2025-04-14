import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Spinner, 
  Text, 
  Badge, 
  Flex,
  useColorModeValue,
  Select,
  HStack,
  Icon,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FaMoneyBillWave, FaArrowUp, FaArrowDown } from 'react-icons/fa'
import * as walletService from '../services/wallet'
import Card from '../components/Card'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'sent', 'received'
  const [searchTerm, setSearchTerm] = useState('')

  // Theme-aware colors
  const headingColor = useColorModeValue('gray.700', 'white')
  const badgeBgSent = useColorModeValue('red.100', 'red.800')
  const badgeBgReceived = useColorModeValue('green.100', 'green.800')
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.700')

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const data = await walletService.getTransactions()
        setTransactions(data || [])
      } catch (err) {
        setError(err.message || 'Failed to fetch transactions')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  // Determine if transaction is incoming or outgoing
  const isIncoming = (transaction, userId) => {
    return transaction.receiver?._id === userId || transaction.receiver === userId
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount))
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?._id
  }

  // Filter transactions based on selected filter and search term
  const filteredTransactions = transactions.filter(transaction => {
    const userId = getCurrentUserId()
    const incoming = isIncoming(transaction, userId)
    
    // Apply type filter
    if (filter === 'sent' && incoming) return false
    if (filter === 'received' && !incoming) return false
    
    // Apply search filter (if any)
    if (searchTerm) {
      const description = transaction.description?.toLowerCase() || ''
      const senderName = transaction.sender?.name?.toLowerCase() || ''
      const receiverName = transaction.receiver?.name?.toLowerCase() || ''
      const searchLower = searchTerm.toLowerCase()
      
      return description.includes(searchLower) || 
             senderName.includes(searchLower) || 
             receiverName.includes(searchLower)
    }
    
    return true
  })

  if (loading) {
    return (
      <Flex height="300px" align="center" justify="center">
        <Spinner size="xl" thickness="4px" />
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
        Transaction History
      </Heading>
      
      <Card mb={6}>
        <HStack spacing={4} mb={4} flexWrap="wrap">
          <FormControl maxW="200px">
            <FormLabel fontSize="sm">Filter</FormLabel>
            <Select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              size="sm"
            >
              <option value="all">All Transactions</option>
              <option value="sent">Money Sent</option>
              <option value="received">Money Received</option>
            </Select>
          </FormControl>
          
          <FormControl maxW="300px">
            <FormLabel fontSize="sm">Search</FormLabel>
            <Input 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
            />
          </FormControl>
        </HStack>
        
        {transactions.length === 0 ? (
          <Text textAlign="center" py={8} color="gray.500">
            No transactions found
          </Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bgColor={tableHeaderBg}>
                <Tr>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th>Sender/Receiver</Th>
                  <Th>Status</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((txn) => {
                  const userId = getCurrentUserId()
                  const isIncomingTxn = isIncoming(txn, userId)
                  
                  return (
                    <Tr key={txn._id}>
                      <Td>{formatDate(txn.createdAt)}</Td>
                      <Td>{txn.description || 'Transaction'}</Td>
                      <Td>
                        {isIncomingTxn 
                          ? `From: ${txn.sender?.name || 'Unknown'}`
                          : `To: ${txn.receiver?.name || 'Unknown'}`
                        }
                      </Td>
                      <Td>
                        <Badge 
                          bg={txn.status === 'completed' ? 'green.100' : 'yellow.100'} 
                          color={txn.status === 'completed' ? 'green.800' : 'yellow.800'}
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {txn.status}
                        </Badge>
                      </Td>
                      <Td isNumeric>
                        <Flex justify="flex-end" align="center">
                          <Icon 
                            as={isIncomingTxn ? FaArrowDown : FaArrowUp} 
                            color={isIncomingTxn ? 'green.500' : 'red.500'} 
                            mr={2} 
                          />
                          <Text color={isIncomingTxn ? 'green.500' : 'red.500'}>
                            {isIncomingTxn ? '+' : '-'} {formatCurrency(txn.amount)}
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        )}
      </Card>
    </Box>
  )
}
