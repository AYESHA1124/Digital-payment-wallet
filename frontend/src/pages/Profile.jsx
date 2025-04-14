import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Badge, 
  useToast, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Divider, 
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Icon,
  Avatar,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FaUserShield, FaKey, FaUserEdit, FaShieldAlt, FaBell } from 'react-icons/fa'
import auth from '../services/auth'
import Card from '../components/Card'
import VerificationBanner from '../components/VerificationBanner'
import TwoFactorSetup from './TwoFactorSetup'
import { NotificationDemo } from '../components/NotificationSystem'

export default function Profile() {
  const [user, setUser] = useState(auth.getCurrentUser())
  const [activeTab, setActiveTab] = useState(0)
  const toast = useToast()

  // Theme colors
  const headingColor = useColorModeValue('gray.700', 'white')
  const labelColor = useColorModeValue('gray.600', 'gray.400')
  const tabBg = useColorModeValue('gray.50', 'gray.700')
  const tabSelectedBg = useColorModeValue('white', 'gray.800')
  const tabSelectedColor = useColorModeValue('brand.500', 'brand.400')
  const badgeBgVerified = useColorModeValue('green.100', 'green.800')
  const badgeBgUnverified = useColorModeValue('red.100', 'red.800')

  useEffect(() => {
    // Fetch the latest user data
    const fetchUserData = async () => {
      try {
        const userData = await auth.getCurrentUserDetails()
        setUser(userData)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch user details',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }
    }

    fetchUserData()
  }, [toast])

  const handleResendVerification = async () => {
    try {
      await auth.resendVerification()
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send verification email',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Box>
      <Heading mb={6} size="lg" color={headingColor}>
        My Profile
      </Heading>
      
      {!user?.isVerified && <VerificationBanner mb={6} />}
      
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        {/* User Info Card */}
        <Card gridColumn={{ md: "span 1" }}>
          <VStack spacing={4} align="center">
            <Avatar size="xl" name={user?.name} />
            <Text fontWeight="bold" fontSize="xl" color={headingColor}>
              {user?.name}
            </Text>
            <Text color={labelColor}>{user?.email}</Text>
            <Badge 
              bg={user?.isVerified ? badgeBgVerified : badgeBgUnverified} 
              color={user?.isVerified ? 'green.800' : 'red.800'}
              px={2}
              py={1}
              borderRadius="full"
            >
              {user?.isVerified ? 'Verified' : 'Unverified'}
            </Badge>

            {!user?.isVerified && (
              <Button 
                size="sm"
                colorScheme="blue" 
                onClick={handleResendVerification}
                leftIcon={<FaKey />}
              >
                Verify Email
              </Button>
            )}
          </VStack>
        </Card>

        {/* Main Content */}
        <Card gridColumn={{ md: "span 3" }}>
          <Tabs 
            variant="enclosed" 
            colorScheme="brand" 
            onChange={(index) => setActiveTab(index)}
            index={activeTab}
          >
            <TabList mb={4}>
              <Tab 
                _selected={{ color: tabSelectedColor, bg: tabSelectedBg, borderBottomColor: tabSelectedColor }} 
                bg={tabBg}
                m={0}
                mr={1}
              >
                <Icon as={FaUserEdit} mr={2} />
                Profile
              </Tab>
              <Tab 
                _selected={{ color: tabSelectedColor, bg: tabSelectedBg, borderBottomColor: tabSelectedColor }} 
                bg={tabBg}
                m={0}
                mr={1}
              >
                <Icon as={FaUserShield} mr={2} />
                Security
              </Tab>
              <Tab 
                _selected={{ color: tabSelectedColor, bg: tabSelectedBg, borderBottomColor: tabSelectedColor }} 
                bg={tabBg}
                m={0}
                mr={1}
              >
                <Icon as={FaBell} mr={2} />
                Notifications
              </Tab>
              <Tab 
                _selected={{ color: tabSelectedColor, bg: tabSelectedBg, borderBottomColor: tabSelectedColor }} 
                bg={tabBg}
                m={0}
              >
                <Icon as={FaShieldAlt} mr={2} />
                Two-Factor Auth
              </Tab>
            </TabList>

            <TabPanels>
              {/* Profile Tab */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="bold" color={headingColor}>Personal Information</Text>
                    <Divider my={2} />
                    
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mt={4}>
                      <Box>
                        <Text color={labelColor} fontSize="sm">Full Name</Text>
                        <Text fontWeight="medium">{user?.name}</Text>
                      </Box>
                      <Box>
                        <Text color={labelColor} fontSize="sm">Email</Text>
                        <Text fontWeight="medium">{user?.email}</Text>
                      </Box>
                      <Box>
                        <Text color={labelColor} fontSize="sm">Account Created</Text>
                        <Text fontWeight="medium">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text color={labelColor} fontSize="sm">Wallet Balance</Text>
                        <Text fontWeight="medium">
                          ${user?.walletBalance?.toFixed(2) || '0.00'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Box mt={4}>
                    <Button colorScheme="brand" leftIcon={<FaUserEdit />}>
                      Edit Profile
                    </Button>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="bold" color={headingColor}>Security Settings</Text>
                    <Divider my={2} />
                    
                    <VStack spacing={4} align="stretch" mt={4}>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="email-alerts" mb="0">
                          Email alerts for login attempts
                        </FormLabel>
                        <Switch id="email-alerts" colorScheme="brand" />
                      </FormControl>
                      
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="transaction-confirmation" mb="0">
                          Require confirmation for large transactions
                        </FormLabel>
                        <Switch id="transaction-confirmation" colorScheme="brand" defaultChecked />
                      </FormControl>
                      
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="session-timeout" mb="0">
                          Session timeout
                        </FormLabel>
                        <Select id="session-timeout" w="auto" defaultValue="30">
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                        </Select>
                      </FormControl>
                      
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="biometric-login" mb="0">
                          Enable biometric login (if available)
                        </FormLabel>
                        <Switch id="biometric-login" colorScheme="brand" />
                      </FormControl>
                    </VStack>
                  </Box>

                  <Box mt={4}>
                    <Button colorScheme="blue" leftIcon={<FaKey />}>
                      Change Password
                    </Button>
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Notifications Tab */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="bold" color={headingColor}>Notification Preferences</Text>
                    <Divider my={2} />
                    
                    <VStack spacing={4} align="stretch" mt={4}>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="transaction-notifications" mb="0">
                          Transaction notifications
                        </FormLabel>
                        <Switch id="transaction-notifications" colorScheme="green" defaultChecked />
                      </FormControl>
                      
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="security-notifications" mb="0">
                          Security alerts
                        </FormLabel>
                        <Switch id="security-notifications" colorScheme="purple" defaultChecked />
                      </FormControl>
                      
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="balance-notifications" mb="0">
                          Low balance alerts
                        </FormLabel>
                        <Switch id="balance-notifications" colorScheme="red" defaultChecked />
                      </FormControl>
                      
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="payment-reminders" mb="0">
                          Payment due reminders
                        </FormLabel>
                        <Switch id="payment-reminders" colorScheme="blue" defaultChecked />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel htmlFor="notification-method" color={labelColor}>
                          Preferred notification method
                        </FormLabel>
                        <Select id="notification-method" defaultValue="push">
                          <option value="push">Push notifications</option>
                          <option value="email">Email</option>
                          <option value="both">Both push and email</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </Box>
                  
                  <Box mt={6}>
                    <Text fontWeight="bold" color={headingColor} mb={3}>
                      Test Notifications
                    </Text>
                    <NotificationDemo />
                  </Box>
                </VStack>
              </TabPanel>

              {/* Two-Factor Auth Tab */}
              <TabPanel p={0}>
                <TwoFactorSetup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      </SimpleGrid>
    </Box>
  )
}
