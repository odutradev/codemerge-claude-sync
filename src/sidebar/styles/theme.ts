import { createTheme, alpha } from '@mui/material/styles';

import { FILE_COLORS } from '@/sidebar/styles/constants';

import type { ThemeMode } from '@/sidebar/types';

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