import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#da7756' },
    background: { default: '#1a1a1a', paper: '#262626' },
    text: { primary: '#ffffff', secondary: '#a1a1a1' }
  },
  typography: {
    fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'].join(','),
    fontSize: 12
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': { width: 8, height: 8 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#424242',
            borderRadius: 4,
            '&:hover': { backgroundColor: '#616161' }
          },
          '&::-webkit-scrollbar-corner': { background: 'transparent' }
        }
      }
    },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
    MuiCheckbox: { styleOverrides: { root: { padding: 4 } } }
  }
});

export default theme;