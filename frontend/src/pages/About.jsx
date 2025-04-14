import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  Icon,
  Divider,
  useColorModeValue,
  Flex,
  HStack,
  Badge
} from '@chakra-ui/react';
import { FaShieldAlt, FaLock, FaUserSecret, FaBolt, FaGlobe, FaMobileAlt } from 'react-icons/fa';

export default function About() {
  const bg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('brand.600', 'brand.400');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const boxBg = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box>
      {/* Hero Section */}
      <Box py={12} bg={boxBg} mb={10} borderRadius="lg">
        <Container maxW="container.lg">
          <VStack spacing={6} align="center" textAlign="center">
            <Image 
              src="/logo.svg" 
              alt="Digital Wallet Logo" 
              boxSize={{ base: "100px", md: "150px" }}
              mb={2}
            />
            <Heading as="h1" size="2xl" color={headingColor} mb={2}>
              About Digital Wallet
            </Heading>
            <Text fontSize="xl" maxW="800px" color={textColor}>
              Reimagining financial transactions for the digital age
            </Text>
          </VStack>
        </Container>
      </Box>
      
      {/* Mission Statement */}
      <Box mb={12}>
        <Container maxW="container.md">
          <VStack spacing={6} align="start">
            <Heading as="h2" size="lg" color={headingColor}>
              Our Mission
            </Heading>
            <Text fontSize="lg" color={textColor}>
              At Digital Wallet, our mission is to provide a secure, fast, and user-friendly platform for managing digital finances. 
              We believe financial technology should be accessible to everyone, regardless of technical expertise or background.
            </Text>
            <Text fontSize="lg" color={textColor}>
              Founded in 2023, we've focused on building a solution that combines robust security with an exceptional user experience, 
              making digital payments as simple as sending a text message.
            </Text>
          </VStack>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box mb={12}>
        <Container maxW="container.lg">
          <Heading as="h2" size="lg" color={headingColor} mb={8}>
            Key Features
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature 
              icon={FaBolt} 
              title="Instant Transfers" 
              text="Send and receive money instantly with zero waiting time for transaction processing."
            />
            <Feature 
              icon={FaGlobe} 
              title="Global Access" 
              text="Access your funds from anywhere in the world with our cloud-based platform."
            />
            <Feature 
              icon={FaMobileAlt} 
              title="Mobile First" 
              text="Designed for the modern user with full functionality on all mobile devices."
            />
          </SimpleGrid>
        </Container>
      </Box>
      
      <Divider my={12} />
      
      {/* Security Section */}
      <Box mb={12}>
        <Container maxW="container.lg">
          <Heading as="h2" size="lg" color={headingColor} mb={8}>
            Security is our Priority
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature 
              icon={FaShieldAlt} 
              title="Bank-Grade Encryption" 
              text="We use the same encryption standards employed by leading financial institutions."
            />
            <Feature 
              icon={FaLock} 
              title="Two-Factor Authentication" 
              text="Additional layer of security to protect your account from unauthorized access."
            />
            <Feature 
              icon={FaUserSecret} 
              title="Privacy Protection" 
              text="Your personal and financial data is never shared with third parties without consent."
            />
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Company Values */}
      <Box mb={12} bg={boxBg} py={10} borderRadius="lg">
        <Container maxW="container.lg">
          <Heading as="h2" size="lg" color={headingColor} mb={8} textAlign="center">
            Our Values
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <VStack align="start" p={6} bg={bg} borderRadius="md" shadow="md">
              <Heading size="md" mb={2}>Innovation</Heading>
              <Text color={textColor}>
                We constantly push boundaries to create new solutions that improve how people manage digital finances.
              </Text>
            </VStack>
            
            <VStack align="start" p={6} bg={bg} borderRadius="md" shadow="md">
              <Heading size="md" mb={2}>Transparency</Heading>
              <Text color={textColor}>
                Clear communication about fees, policies, and how we handle your data is fundamental to our business.
              </Text>
            </VStack>
            
            <VStack align="start" p={6} bg={bg} borderRadius="md" shadow="md">
              <Heading size="md" mb={2}>Accessibility</Heading>
              <Text color={textColor}>
                Building tools that are intuitive and accessible to users of all technical abilities and backgrounds.
              </Text>
            </VStack>
            
            <VStack align="start" p={6} bg={bg} borderRadius="md" shadow="md">
              <Heading size="md" mb={2}>Security</Heading>
              <Text color={textColor}>
                Treating security as our highest priority, with regular audits and implementing industry best practices.
              </Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Team Section - Simplified */}
      <Box mb={12}>
        <Container maxW="container.lg">
          <Heading as="h2" size="lg" color={headingColor} mb={4}>
            Our Team
          </Heading>
          <Text fontSize="lg" color={textColor} mb={8}>
            We're a team of payment industry veterans, security specialists, and user experience experts working together 
            to build the future of digital financial services.
          </Text>
          
          <Flex justifyContent="center">
            <Badge colorScheme="green" p={2} fontSize="md">
              Backed by leading investors in financial technology
            </Badge>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

// Feature component for reuse
function Feature({ title, text, icon }) {
  return (
    <VStack align="start" spacing={3}>
      <Flex
        w={12}
        h={12}
        align="center"
        justify="center"
        rounded="full"
        bg={useColorModeValue('brand.100', 'brand.900')}
        color={useColorModeValue('brand.600', 'brand.300')}
      >
        <Icon as={icon} w={6} h={6} />
      </Flex>
      <Heading as="h3" size="md">
        {title}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>
        {text}
      </Text>
    </VStack>
  );
} 