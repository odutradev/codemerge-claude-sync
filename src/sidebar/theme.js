import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#da7756', // Accent color similar to original accent-secondary-100
    },
    background: {
      default: '#1a1a1a', // bg-000 approx
      paper: '#262626',   // bg-200 approx
    },
    text: {
      primary: '#ffffff', // text-100
      secondary: '#a1a1a1', // text-300
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 4,
        },
      },
    },
  },
});

export default theme;