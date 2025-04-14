import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Icon,
  Divider,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  useToast,
  Image
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaQuestion } from 'react-icons/fa';

export default function Contact() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const headingColor = useColorModeValue('brand.600', 'brand.400');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const boxBg = useColorModeValue('gray.50', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: 'Message sent!',
        description: 'We will get back to you as soon as possible.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
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
              Contact Us
            </Heading>
            <Text fontSize="xl" maxW="800px" color={textColor}>
              We're here to help with any questions about our digital wallet services
            </Text>
          </VStack>
        </Container>
      </Box>
      
      <Container maxW="container.xl" mb={20}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          {/* Contact Information */}
          <VStack align="start" spacing={8}>
            <Box>
              <Heading as="h2" size="lg" color={headingColor} mb={6}>
                Contact Information
              </Heading>
              
              <VStack spacing={6} align="start">
                <ContactInfo 
                  icon={FaMapMarkerAlt} 
                  title="Our Office" 
                  details={["123 Financial Street", "Tech District", "New York, NY 10001"]} 
                />
                
                <ContactInfo 
                  icon={FaPhone} 
                  title="Phone" 
                  details={["+1 (555) 123-4567", "+1 (555) 987-6543"]} 
                />
                
                <ContactInfo 
                  icon={FaEnvelope} 
                  title="Email" 
                  details={["support@digitalwallet.com", "info@digitalwallet.com"]} 
                />
                
                <ContactInfo 
                  icon={FaClock} 
                  title="Working Hours" 
                  details={["Monday - Friday: 9 AM - 8 PM EST", "Saturday: 10 AM - 4 PM EST", "Sunday: Closed"]} 
                />
              </VStack>
            </Box>
            
            <Box w="full" p={6} bg={cardBg} borderRadius="md" shadow="md">
              <Heading as="h3" size="md" mb={4}>
                Need Immediate Assistance?
              </Heading>
              <Text color={textColor} mb={4}>
                Our customer support team is available via live chat in the app for premium users. 
                Standard support tickets are typically answered within 24 hours.
              </Text>
              <Button colorScheme="blue" leftIcon={<FaPhone />} size="md">
                Request a Call Back
              </Button>
            </Box>
          </VStack>
          
          {/* Contact Form */}
          <Box p={8} bg={cardBg} borderRadius="lg" shadow="md">
            <Heading as="h2" size="lg" color={headingColor} mb={6}>
              Send Us a Message
            </Heading>
            
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input 
                    type="text" 
                    name="name" 
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email" 
                    name="email" 
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Subject</FormLabel>
                  <Input 
                    type="text" 
                    name="subject" 
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Message</FormLabel>
                  <Textarea 
                    name="message" 
                    placeholder="How can we help you?"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </FormControl>
                
                <Button 
                  type="submit" 
                  colorScheme="brand" 
                  size="lg" 
                  width="full"
                  isLoading={isSubmitting}
                  loadingText="Sending"
                  mt={4}
                >
                  Send Message
                </Button>
              </VStack>
            </form>
          </Box>
        </SimpleGrid>
      </Container>
      
      <Divider my={10} />
      
      {/* FAQs Section */}
      <Container maxW="container.lg" mb={20}>
        <VStack spacing={8} align="start">
          <Heading as="h2" size="lg" color={headingColor}>
            Frequently Asked Questions
          </Heading>
          
          <Accordion allowToggle width="100%">
            <FaqItem 
              question="How secure is the Digital Wallet platform?" 
              answer="Our platform uses bank-grade encryption and follows industry-standard security protocols. We implement two-factor authentication, end-to-end encryption for all transactions, and regular security audits to ensure your funds are protected." 
            />
            
            <FaqItem 
              question="What fees are associated with using Digital Wallet?" 
              answer="Digital Wallet offers free wallet-to-wallet transfers between users. External transfers to bank accounts have a small fee of 1% (capped at $5). International transfers have variable fees depending on the destination country, typically between 1-3%." 
            />
            
            <FaqItem 
              question="How long do transfers take to process?" 
              answer="Internal transfers between Digital Wallet users are instant. Transfers to external bank accounts typically take 1-2 business days, depending on your bank's processing times." 
            />
            
            <FaqItem 
              question="Is there a limit to how much I can transfer?" 
              answer="Basic accounts have a monthly transfer limit of $10,000. Verified accounts have a limit of $50,000. Business accounts have higher limits based on their specific needs and verification level." 
            />
            
            <FaqItem 
              question="How do I recover my account if I forget my password?" 
              answer="You can use the 'Forgot Password' feature on the login page. We'll send a password reset link to your registered email address. If you have two-factor authentication enabled, you'll need to complete that verification step as well." 
            />
          </Accordion>
          
          <Flex width="full" justifyContent="center" mt={6}>
            <Button leftIcon={<FaQuestion />} colorScheme="blue" variant="outline" size="lg">
              View All FAQs
            </Button>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}

// Contact information component
function ContactInfo({ icon, title, details }) {
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  return (
    <HStack align="start" spacing={4}>
      <Flex
        w={10}
        h={10}
        align="center"
        justify="center"
        rounded="full"
        bg={useColorModeValue('brand.100', 'brand.900')}
        color={useColorModeValue('brand.600', 'brand.300')}
      >
        <Icon as={icon} w={5} h={5} />
      </Flex>
      <Box>
        <Heading as="h3" size="md" mb={1}>
          {title}
        </Heading>
        <VStack align="start" spacing={1}>
          {details.map((detail, index) => (
            <Text key={index} color={textColor}>
              {detail}
            </Text>
          ))}
        </VStack>
      </Box>
    </HStack>
  );
}

// FAQ item component
function FaqItem({ question, answer }) {
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  return (
    <AccordionItem border="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')} borderRadius="md" mb={3}>
      <h2>
        <AccordionButton py={4}>
          <Box flex="1" textAlign="left" fontWeight="600">
            {question}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4} color={textColor}>
        {answer}
      </AccordionPanel>
    </AccordionItem>
  );
} 