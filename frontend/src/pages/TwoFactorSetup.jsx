import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  PinInput,
  PinInputField,
  useToast,
  Alert,
  AlertIcon,
  Image,
  Flex,
  Switch,
  FormControl,
  FormLabel,
  useColorModeValue
} from '@chakra-ui/react';
import Card from '../components/Card';
import auth from '../services/auth';

export default function TwoFactorSetup() {
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [step, setStep] = useState('start'); // start, setup, verify, success
  const toast = useToast();

  // Theme colors
  const headingColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const successBg = useColorModeValue('green.50', 'green.900');
  const successColor = useColorModeValue('green.800', 'green.200');

  useEffect(() => {
    // Check if 2FA is already enabled
    const checkTwoFactorStatus = async () => {
      setLoading(true);
      try {
        const response = await auth.getTwoFactorStatus();
        setIsEnabled(response.isEnabled);
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to check 2FA status',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    checkTwoFactorStatus();
  }, [toast]);

  const handleSetup = async () => {
    setSetupLoading(true);
    try {
      const response = await auth.setupTwoFactor();
      setQrCode(response.qrCode);
      setSecret(response.secret);
      setStep('setup');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to setup 2FA',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 6-digit code',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await auth.verifyTwoFactor(verificationCode);
      setIsEnabled(true);
      setStep('success');
      toast({
        title: 'Success',
        description: 'Two-factor authentication has been enabled',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid verification code',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      await auth.disableTwoFactor();
      setIsEnabled(false);
      setStep('start');
      toast({
        title: 'Success',
        description: 'Two-factor authentication has been disabled',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disable 2FA',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    if (isEnabled) {
      return (
        <VStack spacing={4} align="stretch">
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            Two-factor authentication is enabled for your account
          </Alert>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="two-factor-toggle" mb="0">
              Two-Factor Authentication
            </FormLabel>
            <Switch
              id="two-factor-toggle"
              isChecked={isEnabled}
              onChange={handleDisable}
              colorScheme="green"
              isDisabled={loading}
            />
          </FormControl>
          <Text color={textColor}>
            To disable two-factor authentication, toggle the switch above.
          </Text>
        </VStack>
      );
    }

    if (step === 'start') {
      return (
        <VStack spacing={4} align="stretch">
          <Text color={textColor}>
            Two-factor authentication adds an extra layer of security to your account.
            When enabled, you'll need to provide a verification code from your
            authentication app along with your password when signing in.
          </Text>
          <Button 
            colorScheme="blue" 
            onClick={handleSetup} 
            isLoading={setupLoading}
            loadingText="Setting up..."
          >
            Set up two-factor authentication
          </Button>
        </VStack>
      );
    }

    if (step === 'setup') {
      return (
        <VStack spacing={6} align="stretch">
          <Text color={textColor}>
            Scan this QR code with your authentication app (like Google Authenticator,
            Authy, or Microsoft Authenticator).
          </Text>
          
          <Flex justifyContent="center" mb={4}>
            {qrCode && <Image src={qrCode} alt="QR Code" maxW="200px" />}
          </Flex>
          
          <Text color={textColor} fontWeight="bold">
            Or enter this code manually:
          </Text>
          <Text fontSize="md" fontFamily="monospace" letterSpacing="wider" textAlign="center">
            {secret}
          </Text>
          
          <Box mt={6}>
            <Text mb={2} color={textColor}>
              Enter the 6-digit verification code from your app:
            </Text>
            <HStack justifyContent="center">
              <PinInput otp value={verificationCode} onChange={setVerificationCode}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Box>
          
          <Button 
            colorScheme="blue" 
            onClick={handleVerify} 
            isLoading={loading}
            isDisabled={verificationCode.length !== 6}
            mt={4}
          >
            Verify and Enable
          </Button>
        </VStack>
      );
    }

    if (step === 'success') {
      return (
        <VStack spacing={4} align="stretch" p={4} bg={successBg} borderRadius="md">
          <Heading size="md" color={successColor}>
            Two-Factor Authentication Enabled
          </Heading>
          <Text color={textColor}>
            Your account is now protected with two-factor authentication. You'll need to
            enter a verification code from your authentication app when you sign in.
          </Text>
          <Alert status="warning" mt={4}>
            <AlertIcon />
            Save your backup codes in a secure place. You'll need them if you lose access to your device.
          </Alert>
        </VStack>
      );
    }
  };

  return (
    <Box>
      <Heading mb={6} size="lg" color={headingColor}>
        Two-Factor Authentication
      </Heading>
      <Card>
        {renderStepContent()}
      </Card>
    </Box>
  );
} 