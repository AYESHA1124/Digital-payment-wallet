import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Stat, 
  StatLabel, 
  StatNumber, 
  Button, 
  Spinner, 
  Flex,
  Text,
  useColorModeValue,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Badge,
  HStack,
  Icon,
  Spacer
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import walletService from '../services/wallet'
import Card from '../components/Card'
import { ArrowUpIcon, ArrowDownIcon, RepeatIcon, StarIcon } from '@chakra-ui/icons'
import { FaMoneyBillWave, FaShoppingCart, FaUtensils, FaHome, FaCar, FaPlane } from 'react-icons/fa'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// Category icons mapping
const categoryIcons = {
  food: FaUtensils,
  shopping: FaShoppingCart,
  bills: FaMoneyBillWave,
  housing: FaHome,
  transport: FaCar,
  travel: FaPlane
};

// Category colors
const categoryColors = {
  food: '#FF8A65',
  shopping: '#64B5F6',
  bills: '#9575CD',
  housing: '#4DB6AC',
  transport: '#FFD54F',
  travel: '#7986CB'
};

// Mock data for categories (in a real app, this would come from backend)
const mockCategories = [
  { name: 'Food', value: 250, category: 'food' },
  { name: 'Shopping', value: 300, category: 'shopping' },
  { name: 'Bills', value: 400, category: 'bills' },
  { name: 'Housing', value: 800, category: 'housing' },
  { name: 'Transport', value: 150, category: 'transport' },
  { name: 'Travel', value: 200, category: 'travel' }
];

// Mock data for monthly spending (in a real app, this would come from backend)
const mockMonthlyData = [
  { name: 'Jan', amount: 1200 },
  { name: 'Feb', amount: 1800 },
  { name: 'Mar', amount: 1400 },
  { name: 'Apr', amount: 2000 },
  { name: 'May', amount: 1700 },
  { name: 'Jun', amount: 1500 }
];

// Mock transactions with categories
const mockTransactions = [
  { id: 1, description: 'Grocery Shopping', amount: -85.50, category: 'food', date: '2023-06-25' },
  { id: 2, description: 'Salary Deposit', amount: 2500, category: 'income', date: '2023-06-24' },
  { id: 3, description: 'Electricity Bill', amount: -120, category: 'bills', date: '2023-06-22' },
  { id: 4, description: 'Online Purchase', amount: -65.99, category: 'shopping', date: '2023-06-20' },
  { id: 5, description: 'Rent Payment', amount: -800, category: 'housing', date: '2023-06-15' }
];

export default function Dashboard() {
  const [walletData, setWalletData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [spendingByCategory, setSpendingByCategory] = useState([])
  const [monthlySpending, setMonthlySpending] = useState([])

  // Theme-aware colors
  const headingColor = useColorModeValue('gray.700', 'white')
  const statLabelColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('brand.500', 'brand.400')
  const chartBgColor = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const tabBgActive = useColorModeValue('brand.500', 'brand.600')
  const tabColor = useColorModeValue('gray.600', 'gray.400')

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Fetch real wallet balance
        const balanceData = await walletService.getBalance()
        const transactionsData = await walletService.getTransactions()
        
        setWalletData({
          balance: balanceData.balance,
          recentTransactions: transactionsData?.length || 0
        })
        
        // For demo purposes, we'll use mock data for the visualizations
        // In a real app, you would process the actual transaction data
        setTransactions(mockTransactions)
        setSpendingByCategory(mockCategories)
        setMonthlySpending(mockMonthlyData)
        
      } catch (err) {
        setError(err.message || 'Failed to fetch wallet data')
      } finally {
        setLoading(false)
      }
    }
    fetchWalletData()
  }, [])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Get transaction badge color based on amount
  const getTransactionColor = (amount) => {
    return amount >= 0 ? 'green' : 'red';
  }

  // Get category icon
  const getCategoryIcon = (category) => {
    return categoryIcons[category] || StarIcon;
  }

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
      <Heading mb={8} size="lg" color={headingColor}>
        Your Dashboard
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card>
          <Stat>
            <StatLabel color={statLabelColor}>Wallet Balance</StatLabel>
            <Flex align="center">
              <StatNumber color={accentColor}>${walletData?.balance?.toFixed(2) || '0.00'}</StatNumber>
            </Flex>
          </Stat>
        </Card>
        
        <Card>
          <Stat>
            <StatLabel color={statLabelColor}>Recent Transactions</StatLabel>
            <Flex align="center">
              <StatNumber>{walletData?.recentTransactions || 0}</StatNumber>
              <RepeatIcon ml={2} color="blue.500" />
            </Flex>
          </Stat>
        </Card>
        
        <Card>
          <Stat>
            <StatLabel color={statLabelColor}>Quick Actions</StatLabel>
            <Flex mt={2} gap={2}>
              <Button leftIcon={<ArrowUpIcon />} colorScheme="green" size="sm" as={Link} to="/send-money">
                Send
              </Button>
              <Button leftIcon={<ArrowDownIcon />} colorScheme="blue" size="sm">
                Receive
              </Button>
            </Flex>
          </Stat>
        </Card>
      </SimpleGrid>

      <Tabs colorScheme="brand" variant="soft-rounded" isFitted mb={8}>
        <TabList mb={4}>
          <Tab _selected={{ color: 'white', bg: tabBgActive }} color={tabColor}>Overview</Tab>
          <Tab _selected={{ color: 'white', bg: tabBgActive }} color={tabColor}>Spending</Tab>
          <Tab _selected={{ color: 'white', bg: tabBgActive }} color={tabColor}>Transactions</Tab>
        </TabList>
        
        <TabPanels>
          {/* Overview Tab */}
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card>
                <Heading size="md" mb={4} color={headingColor}>
                  Monthly Spending
                </Heading>
                <Box height="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="amount" fill={accentColor} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
              
              <Card>
                <Heading size="md" mb={4} color={headingColor}>
                  Spending by Category
                </Heading>
                <Box height="250px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendingByCategory}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {spendingByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={categoryColors[entry.category]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </SimpleGrid>
          </TabPanel>
          
          {/* Spending Tab */}
          <TabPanel px={0}>
            <Card>
              <Heading size="md" mb={6} color={headingColor}>
                Spending Trends
              </Heading>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke={accentColor} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              
              <Heading size="sm" mt={8} mb={4} color={headingColor}>
                Spending by Category
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {spendingByCategory.map((category) => (
                  <Card key={category.name} p={3}>
                    <Flex align="center">
                      <Icon as={getCategoryIcon(category.category)} boxSize={5} color={categoryColors[category.category]} mr={2} />
                      <StatLabel color={textColor}>{category.name}</StatLabel>
                      <Spacer />
                      <Text fontWeight="bold" color={textColor}>{formatCurrency(category.value)}</Text>
                    </Flex>
                  </Card>
                ))}
              </SimpleGrid>
            </Card>
          </TabPanel>
          
          {/* Transactions Tab */}
          <TabPanel px={0}>
            <Card>
              <Heading size="md" mb={4} color={headingColor}>
                Recent Transactions
              </Heading>
              
              {transactions.map((transaction) => (
                <Box 
                  key={transaction.id}
                  p={3}
                  mb={2}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                >
                  <Flex align="center">
                    <Icon 
                      as={getCategoryIcon(transaction.category)} 
                      boxSize={5} 
                      color={transaction.amount >= 0 ? 'green.500' : categoryColors[transaction.category] || 'gray.500'} 
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="medium" color={textColor}>{transaction.description}</Text>
                      <Text fontSize="sm" color={statLabelColor}>{transaction.date}</Text>
                    </Box>
                    <Spacer />
                    <Badge colorScheme={getTransactionColor(transaction.amount)}>
                      {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </Badge>
                  </Flex>
                </Box>
              ))}
              
              <Button as={Link} to="/transactions" colorScheme="brand" variant="outline" w="full" mt={4}>
                View All Transactions
              </Button>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card>
          <Heading size="md" mb={4} color={headingColor}>
            Quick Actions
          </Heading>
          <Flex gap={4} flexWrap="wrap">
            <Button as={Link} to="/wallet" colorScheme="brand" variant="solid">
              View Wallet
            </Button>
            <Button as={Link} to="/transactions" colorScheme="purple" variant="solid">
              View Transactions
            </Button>
            <Button as={Link} to="/send-money" colorScheme="green">
              Send Money
            </Button>
          </Flex>
        </Card>
        
        <Card>
          <Heading size="md" mb={4} color={headingColor}>
            Financial Tips
          </Heading>
          <Text color={textColor} mb={2}>
            <Icon as={StarIcon} color="yellow.500" mr={2} />
            Save 20% of your income each month for financial security.
          </Text>
          <Text color={textColor} mb={2}>
            <Icon as={StarIcon} color="yellow.500" mr={2} />
            Review your recurring subscriptions to identify potential savings.
          </Text>
          <Text color={textColor}>
            <Icon as={StarIcon} color="yellow.500" mr={2} />
            Use the bill reminder feature to avoid late payment fees.
          </Text>
        </Card>
      </SimpleGrid>
      
      {/* Additional Financial Reports - Just for demonstration */}
      <Box mt={8}>
        <Heading size="md" mb={4} color={headingColor}>
          Financial Reports
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} p={4}>
              <Flex align="center">
                <Icon as={StarIcon} color="purple.500" mr={2} />
                <Text fontWeight="bold" color={textColor}>
                  Report #{index + 1}
                </Text>
                <Spacer />
                <Badge colorScheme="purple">New</Badge>
              </Flex>
              <Text mt={2} color={statLabelColor}>
                Financial insight report for your reference
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  )
}
