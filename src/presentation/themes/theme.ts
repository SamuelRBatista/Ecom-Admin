import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#7e6560',
      light: '#a89288',
      dark: '#5a4a42',
    },
    secondary: {
      main: '#28a745',
      light: '#5cb85c',
      dark: '#1e7e34',
    },
    success: {
      main: '#28a745',
    },
    error: {
      main: '#dc3545',
    },
    warning: {
      main: '#ffc107',
    },
    info: {
      main: '#17a2b8',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#7e6560',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#7e6560',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#7e6560',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          padding: '10px 24px',
        },
        containedPrimary: {
          backgroundColor: '#7e6560',
          '&:hover': {
            backgroundColor: '#5a4a42',
          },
        },
        containedSuccess: {
          backgroundColor: '#28a745',
          '&:hover': {
            backgroundColor: '#1e7e34',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
              borderColor: '#7e6560',
            },
          },
        },
      },
    },
  
  },
});

export const colors = {
  primary: '#7e6560',
  primaryLight: '#a89288',
  primaryDark: '#5a4a42',
  primarySecundary: '#fdfdfc',
  secondary: '#28a745',
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  background: '#f5f5f5',
  border: '#ddd',
  text: {
    primary: '#333',
    secondary: '#666',
    light: '#999',
  },
};
