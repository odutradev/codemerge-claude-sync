import { createTheme, alpha } from '@mui/material/styles';

import type { ThemeMode } from '@/sidebar/types';

const FILE_COLORS = {
  docker: '#2496ED',
  makefile: '#666666',
  npm: '#CB3837',
  typescript: '#3178C6',
  javascript: '#F7DF1E',
  react: '#61DAFB',
  html: '#E34C26',
  css: '#1572B6',
  sass: '#CC6699',
  less: '#1D365D',
  json: '#F7DF1E',
  config: '#6E7681',
  csv: '#217346',
  markdown: '#ffffff',
  text: '#9E9E9E',
  pdf: '#F44336',
  java: '#007396',
  python: '#3776AB',
  c: '#A8B9CC',
  cpp: '#00599C',
  csharp: '#239120',
  php: '#777BB4',
  go: '#00ADD8',
  rust: '#DEA584',
  ruby: '#CC342D',
  kotlin: '#7F52FF',
  swift: '#F05138',
  dart: '#0175C2',
  lua: '#2C2D72',
  sql: '#336791',
  db: '#607D8B',
  bash: '#4EAA25',
  terminal: '#455A64',
  media: '#9C27B0',
  zip: '#FDD835'
};

export const getAppTheme = (themeMode: ThemeMode, primaryColor: string, prefersDarkMode: boolean) => {
  const mode = themeMode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : themeMode;
  const isDark = mode === 'dark';
  const SCROLLBAR = '3px';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor
      },
      fileColors: FILE_COLORS,
      background: {
        default: isDark ? '#1a1a1a' : '#f5f5f5',
        paper: isDark ? '#262626' : '#ffffff'
      }
    },
    typography: {
      fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "sans-serif"].join(","),
      fontSize: 12
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          body: {
            scrollbarWidth: "thin",
            scrollbarColor: `${alpha(theme.palette.text.primary, 0.1)} transparent`,
            "&::-webkit-scrollbar": {
              width: SCROLLBAR,
              height: SCROLLBAR
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent"
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.text.primary, 0.1),
              borderRadius: SCROLLBAR,
              "&:hover": {
                backgroundColor: alpha(theme.palette.text.primary, 0.12)
              }
            },
            "&::-webkit-scrollbar-corner": {
              background: "transparent"
            },
            "& *::-webkit-scrollbar": {
              width: SCROLLBAR,
              height: SCROLLBAR
            },
            "& *::-webkit-scrollbar-track": {
              background: "transparent"
            },
            "& *::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.text.primary, 0.1),
              borderRadius: SCROLLBAR,
              "&:hover": {
                backgroundColor: alpha(theme.palette.text.primary, 0.12)
              }
            }
          }
        })
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8
          }
        }
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            padding: 4
          }
        }
      }
    }
  });
};