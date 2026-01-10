import React, { useState, useEffect, useMemo } from 'react';
import { Box, Tabs, Tab, useMediaQuery, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import SyncView from './tabs/sync';
import ArtifactsView from './tabs/artifacts';
import SettingsView from './tabs/settings';
import useConfigStore from './store/configStore';

const App = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const { loadFromBackground, themeMode, primaryColor } = useConfigStore();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        loadFromBackground();
    }, [loadFromBackground]);

    const theme = useMemo(() => {
        const mode = themeMode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : themeMode;
        
        return createTheme({
            palette: {
                mode,
                primary: {
                    main: primaryColor,
                },
                background: {
                    default: mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    paper: mode === 'dark' ? '#262626' : '#ffffff',
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
    }, [themeMode, primaryColor, prefersDarkMode]);

    const fetchViaBackground = (url, options = {}) => {
        return new Promise((resolve) => {
            if (chrome && chrome.runtime) {
                chrome.runtime.sendMessage({
                    type: 'FETCH_URL',
                    url: url,
                    options: options
                }, resolve);
            } else {
                resolve({ success: false, error: 'Chrome Runtime não disponível' });
            }
        });
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={currentTab} 
                        onChange={handleTabChange} 
                        aria-label="sidebar tabs" 
                        variant="standard"
                        textColor="primary" 
                        indicatorColor="primary"
                        sx={{
                            '& .MuiTabs-flexContainer': {
                                display: 'flex',
                            }
                        }}
                    >
                        <Tab label="Sync" sx={{ flexGrow: 1, flexBasis: 0, maxWidth: 'none' }} />
                        <Tab label="Artefatos" sx={{ flexGrow: 1, flexBasis: 0, maxWidth: 'none' }} />
                        <Tab 
                            icon={<SettingsIcon fontSize="small" />} 
                            sx={{ 
                                minWidth: 48, 
                                width: 48, 
                                padding: 0 
                            }} 
                        />
                    </Tabs>
                </Box>
                
                <Box role="tabpanel" hidden={currentTab !== 0} sx={{ flexGrow: 1, height: 'calc(100% - 49px)' }}>
                    {currentTab === 0 && (
                        <SyncView 
                            fetchViaBackground={fetchViaBackground}
                        />
                    )}
                </Box>
                
                <Box role="tabpanel" hidden={currentTab !== 1} sx={{ flexGrow: 1, height: 'calc(100% - 49px)' }}>
                    {currentTab === 1 && (
                        <ArtifactsView 
                            fetchViaBackground={fetchViaBackground}
                        />
                    )}
                </Box>

                <Box role="tabpanel" hidden={currentTab !== 2} sx={{ flexGrow: 1, height: 'calc(100% - 49px)' }}>
                    {currentTab === 2 && (
                        <SettingsView />
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default App;