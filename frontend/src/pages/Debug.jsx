import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Box, Heading, Text, Button, VStack, Spinner, Alert, AlertIcon, Code, useColorModeValue } from '@chakra-ui/react';

export default function Debug() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || 'No token found');
  
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Check for token on mount
    const checkToken = localStorage.getItem('token');
    setToken(checkToken || 'No token found');
  }, []);

  const testBackendConnection = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const response = await api.get('/');
      setResponse(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const response = await api.get('/auth/me');
      setResponse(response.data);
    } catch (err) {
      console.error('Auth API Error:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5}>
      <Heading mb={4}>API Debug Page</Heading>
      
      <Box p={4} bg={bgColor} borderWidth="1px" borderRadius="md" borderColor={borderColor} mb={5}>
        <Heading size="md" mb={2}>Authentication Status</Heading>
        <Text fontFamily="monospace">{token}</Text>
      </Box>
      
      <VStack spacing={4} align="stretch">
        <Button 
          onClick={testBackendConnection} 
          colorScheme="blue" 
          isLoading={loading}
          loadingText="Testing..."
        >
          Test Backend Connection
        </Button>
        
        <Button 
          onClick={testAuthEndpoint} 
          colorScheme="green" 
          isLoading={loading}
          loadingText="Testing..."
        >
          Test Auth Endpoint
        </Button>
        
        {loading && (
          <Box textAlign="center" p={4}>
            <Spinner size="xl" />
            <Text mt={2}>Testing API connection...</Text>
          </Box>
        )}
        
        {error && (
          <Alert status="error" variant="left-accent">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Error: {error.message}</Text>
              {error.status && <Text>Status: {error.status}</Text>}
              {error.data && (
                <Box mt={2}>
                  <Text fontWeight="bold">Response Data:</Text>
                  <Code p={2} w="full" overflowX="auto">
                    {JSON.stringify(error.data, null, 2)}
                  </Code>
                </Box>
              )}
            </Box>
          </Alert>
        )}
        
        {response && (
          <Box p={4} bg={bgColor} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
            <Heading size="sm" mb={2}>Response:</Heading>
            <Code p={2} w="full" overflowX="auto">
              {JSON.stringify(response, null, 2)}
            </Code>
          </Box>
        )}
      </VStack>
    </Box>
  );
} 