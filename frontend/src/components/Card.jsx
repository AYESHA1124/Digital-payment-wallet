import { Box, useColorModeValue } from '@chakra-ui/react';

const Card = ({ children, ...props }) => {
  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box 
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      p={4}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Card; 