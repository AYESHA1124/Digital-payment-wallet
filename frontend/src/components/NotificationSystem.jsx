import { useState, useEffect, createContext, useContext } from 'react';
import {
  Box,
  VStack,
  Text,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Portal,
  useToast,
  Slide,
  Stack
} from '@chakra-ui/react';
import { BellIcon, InfoIcon, CheckCircleIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons';
import { FaMoneyBillWave, FaShieldAlt, FaBell, FaChevronDown } from 'react-icons/fa';

// Create notification context
const NotificationContext = createContext();

// Mock notifications for demo purposes
const initialNotifications = [
  {
    id: 1,
    type: 'transaction',
    title: 'Payment Received',
    message: 'You received $250.00 from John Doe',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    read: false,
  },
  {
    id: 2,
    type: 'security',
    title: 'New Login Detected',
    message: 'Your account was accessed from a new device',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    read: true,
  },
  {
    id: 3,
    type: 'alert',
    title: 'Low Balance Alert',
    message: 'Your account balance is below $100',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    read: false,
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Payment Due',
    message: 'Your electricity bill payment is due tomorrow',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    read: true,
  },
];

// Get icon for notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'transaction':
      return FaMoneyBillWave;
    case 'security':
      return FaShieldAlt;
    case 'alert':
      return WarningIcon;
    case 'reminder':
      return TimeIcon;
    default:
      return InfoIcon;
  }
};

// Get color for notification type
const getNotificationColor = (type) => {
  switch (type) {
    case 'transaction':
      return 'green';
    case 'security':
      return 'purple';
    case 'alert':
      return 'red';
    case 'reminder':
      return 'blue';
    default:
      return 'gray';
  }
};

// Format timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

// NotificationProvider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [realtimeNotification, setRealtimeNotification] = useState(null);
  const toast = useToast();

  // Function to add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev]);
    // Show realtime notification popup
    setRealtimeNotification(newNotification);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setRealtimeNotification(null);
    }, 5000);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Demo function to simulate receiving notifications
  const simulateNotification = (type) => {
    const notifications = {
      transaction: {
        type: 'transaction',
        title: 'Payment Received',
        message: `You received $${(Math.random() * 100).toFixed(2)} from Jane Smith`,
      },
      security: {
        type: 'security',
        title: 'Security Alert',
        message: 'Unusual login attempt detected from New York',
      },
      alert: {
        type: 'alert',
        title: 'Low Balance Warning',
        message: 'Your account balance is below the set threshold',
      },
      reminder: {
        type: 'reminder',
        title: 'Upcoming Payment',
        message: 'Your phone bill is due in 3 days',
      },
    };

    addNotification(notifications[type] || notifications.transaction);
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Values for the context
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    simulateNotification,
    realtimeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Real-time notification popup */}
      <Portal>
        <Slide
          direction="top"
          in={!!realtimeNotification}
          style={{ zIndex: 9999 }}
        >
          {realtimeNotification && (
            <Box 
              position="fixed" 
              top="20px" 
              right="20px" 
              maxW="sm"
              zIndex={9999}
            >
              <NotificationAlert 
                notification={realtimeNotification}
                onClose={() => setRealtimeNotification(null)}
              />
            </Box>
          )}
        </Slide>
      </Portal>
    </NotificationContext.Provider>
  );
};

// Custom hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// NotificationBell component - can be placed in navbar
export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const bellColor = useColorModeValue('gray.600', 'gray.200');
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  return (
    <Menu placement="bottom-end" closeOnSelect={false}>
      <MenuButton 
        as={Button} 
        p={1}
        variant="ghost" 
        borderRadius="full" 
        position="relative"
      >
        <Icon as={BellIcon} boxSize={5} color={bellColor} />
        {unreadCount > 0 && (
          <Badge 
            position="absolute" 
            top="-5px" 
            right="-5px" 
            colorScheme="red" 
            borderRadius="full" 
            fontSize="0.7em"
          >
            {unreadCount}
          </Badge>
        )}
      </MenuButton>
      <MenuList 
        bg={bgColor} 
        borderColor={borderColor} 
        minW="320px" 
        maxH="400px" 
        overflow="auto"
        shadow="lg"
      >
        <Flex p={2} justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">Notifications</Text>
          <Flex>
            {notifications.length > 0 && (
              <>
                <Button size="xs" mr={1} onClick={markAllAsRead}>
                  Mark all read
                </Button>
                <Button size="xs" colorScheme="red" variant="ghost" onClick={clearNotifications}>
                  Clear all
                </Button>
              </>
            )}
          </Flex>
        </Flex>
        <MenuDivider />
        
        {notifications.length === 0 ? (
          <Box p={4} textAlign="center">
            <Text color="gray.500">No notifications</Text>
          </Box>
        ) : (
          <VStack spacing={0} align="stretch">
            {notifications.map(notification => (
              <MenuItem 
                key={notification.id} 
                _hover={{ bg: hoverBg }}
                onClick={() => markAsRead(notification.id)}
                bg={notification.read ? 'transparent' : hoverBg}
              >
                <Flex py={1}>
                  <Box mr={3}>
                    <Icon 
                      as={getNotificationIcon(notification.type)} 
                      color={`${getNotificationColor(notification.type)}.500`}
                      boxSize={5}
                    />
                  </Box>
                  <Box flex="1">
                    <Flex justifyContent="space-between" alignItems="flex-start">
                      <Text fontWeight={notification.read ? 'normal' : 'bold'}>
                        {notification.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500" ml={2}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {notification.message}
                    </Text>
                  </Box>
                </Flex>
              </MenuItem>
            ))}
          </VStack>
        )}
      </MenuList>
    </Menu>
  );
};

// NotificationAlert component - for realtime notifications
export const NotificationAlert = ({ notification, onClose }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const colorScheme = getNotificationColor(notification.type);

  return (
    <Box 
      p={3} 
      bg={bgColor} 
      borderRadius="md" 
      borderLeftWidth="4px" 
      borderLeftColor={`${colorScheme}.500`}
      boxShadow="lg" 
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex>
        <Box mr={3}>
          <Icon 
            as={getNotificationIcon(notification.type)} 
            color={`${colorScheme}.500`}
            boxSize={5}
          />
        </Box>
        <Box flex="1">
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontWeight="bold">
              {notification.title}
            </Text>
            <CloseButton size="sm" onClick={onClose} />
          </Flex>
          <Text fontSize="sm" mt={1}>
            {notification.message}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

// Export the main component
export const NotificationDemo = () => {
  const { simulateNotification } = useNotifications();
  
  return (
    <Box>
      <Text fontWeight="bold" mb={3}>
        Test Notifications
      </Text>
      <Stack direction="row" spacing={3} flexWrap="wrap">
        <Button 
          leftIcon={<Icon as={FaMoneyBillWave} />} 
          colorScheme="green" 
          size="sm"
          onClick={() => simulateNotification('transaction')}
        >
          Transaction
        </Button>
        <Button 
          leftIcon={<Icon as={FaShieldAlt} />} 
          colorScheme="purple" 
          size="sm"
          onClick={() => simulateNotification('security')}
        >
          Security
        </Button>
        <Button 
          leftIcon={<WarningIcon />} 
          colorScheme="red" 
          size="sm"
          onClick={() => simulateNotification('alert')}
        >
          Alert
        </Button>
        <Button 
          leftIcon={<TimeIcon />} 
          colorScheme="blue" 
          size="sm"
          onClick={() => simulateNotification('reminder')}
        >
          Reminder
        </Button>
      </Stack>
    </Box>
  );
};

export default NotificationContext; 