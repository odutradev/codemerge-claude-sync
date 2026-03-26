import { createTheme, alpha } from '@mui/material/styles';

export const getAppTheme = (themeMode, primaryColor, prefersDarkMode) => {
    const mode = themeMode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : themeMode;
    const isDark = mode === 'dark';
    const SCROLLBAR_RADIUS = '3px';
    const SCROLLBAR_SIZE = '3px';

    return createTheme({
        palette: {
            mode,
            primary: { main: primaryColor },
            background: { default: isDark ? '#1a1a1a' : '#f5f5f5', paper: isDark ? '#262626' : '#ffffff' }
        },
        typography: { fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'].join(','), fontSize: 12 },
        components: {
            MuiCssBaseline: {
                styleOverrides: (themeParam) => ({
                    body: {
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${alpha(themeParam.palette.text.primary, 0.1)} transparent`,
                        '&::-webkit-scrollbar': { width: SCROLLBAR_SIZE, height: SCROLLBAR_SIZE },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(themeParam.palette.text.primary, 0.1), borderRadius: SCROLLBAR_RADIUS, '&:hover': { backgroundColor: alpha(themeParam.palette.text.primary, 0.12) } },
                        '&::-webkit-scrollbar-corner': { background: 'transparent' },
                        '& *::-webkit-scrollbar': { width: SCROLLBAR_SIZE, height: SCROLLBAR_SIZE },
                        '& *::-webkit-scrollbar-track': { background: 'transparent' },
                        '& *::-webkit-scrollbar-thumb': { backgroundColor: alpha(themeParam.palette.text.primary, 0.1), borderRadius: SCROLLBAR_RADIUS, '&:hover': { backgroundColor: alpha(themeParam.palette.text.primary, 0.12) } }
                    }
                })
            },
            MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
            MuiCheckbox: { styleOverrides: { root: { padding: 4 } } }
        }
    });
};