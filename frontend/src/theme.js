import { extendTheme } from '@chakra-ui/react';

// Color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Colors for light and dark mode
const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Primary color
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  secondary: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50', // Secondary color
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
};

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'md',
    },
    variants: {
      primary: (props) => ({
        bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.600',
        },
      }),
      secondary: (props) => ({
        bg: props.colorMode === 'dark' ? 'secondary.600' : 'secondary.500',
        color: 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'secondary.700' : 'secondary.600',
        },
      }),
    },
  },
  Card: {
    baseStyle: (props) => ({
      bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
      borderRadius: 'lg',
      boxShadow: 'md',
      p: 4,
    }),
  },
};

// Global styles
const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    },
  }),
};

// Theme object
const theme = extendTheme({
  colors,
  config,
  components,
  styles,
});

export default theme; 