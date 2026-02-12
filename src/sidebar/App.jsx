import React, { useState, useEffect, useMemo } from 'react';
import { Box, Tabs, Tab, useMediaQuery, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import useSelectionStore from './store/selectionStore';
import useConfigStore from './store/configStore';
import ArtifactsView from './tabs/artifacts';
import SettingsView from './tabs/settings';
import SyncView from './tabs/sync';

const App = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const { loadFromBackground, themeMode, primaryColor } = useConfigStore();
    const { checkExpiration } = useSelectionStore();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        loadFromBackground();
        checkExpiration();
    }, [loadFromBackground, checkExpiration]);

    const theme = useMemo(() => {
        const mode = themeMode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : themeMode;
        const isDark = mode === 'dark';

        return createTheme({
            palette: {
                mode,
                primary: { main: primaryColor },
                background: {
                    default: isDark ? '#1a1a1a' : '#f5f5f5',
                    paper: isDark ? '#262626' : '#ffffff'
                }
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
                                backgroundColor: isDark ? '#424242' : '#bdbdbd',
                                borderRadius: 4,
                                '&:hover': { backgroundColor: isDark ? '#616161' : '#9e9e9e' }
                            },
                            '&::-webkit-scrollbar-corner': { background: 'transparent' }
                        }
                    }
                },
                MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } } },
                MuiCheckbox: { styleOverrides: { root: { padding: 4 } } }
            }
        });
    }, [themeMode, primaryColor, prefersDarkMode]);

    const fetchViaBackground = (url, options = {}) => {
        return new Promise((resolve) => {
            if (chrome && chrome.runtime) {
                chrome.runtime.sendMessage({ type: 'FETCH_URL', url, options }, resolve);
            } else {
                resolve({ success: false, error: 'Chrome Runtime não disponível' });
            }
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={currentTab}
                        onChange={(_, v) => setCurrentTab(v)}
                        variant="standard"
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{ '& .MuiTabs-flexContainer': { display: 'flex' } }}
                    >
                        <Tab label="Sync" sx={{ flexGrow: 1, flexBasis: 0, maxWidth: 'none' }} />
                        <Tab label="Artefatos" sx={{ flexGrow: 1, flexBasis: 0, maxWidth: 'none' }} />
                        <Tab icon={<SettingsIcon fontSize="small" />} sx={{ minWidth: 48, width: 48, padding: 0 }} />
                    </Tabs>
                </Box>

                <Box role="tabpanel" hidden={currentTab !== 0} sx={{ flexGrow: 1, height: 'calc(100% - 49px)' }}>
                    {currentTab === 0 && <SyncView fetchViaBackground={fetchViaBackground} />}
                </Box>
                <Box role="tabpanel" hidden={currentTab !== 1} sx={{ flexGrow: 1, height: 'calc(100% - 49px)' }}>
                    {currentTab === 1 && <ArtifactsView fetchViaBackground={fetchViaBackground} />}
                </Box>
                <Box role="tabpanel" hidden={currentTab !== 2} sx={{ flexGrow: 1, height: 'calc(100% - 49px)' }}>
                    {currentTab === 2 && <SettingsView />}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default App;