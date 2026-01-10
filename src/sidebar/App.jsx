import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SyncView from './tabs/sync';
import ArtifactsView from './tabs/artifacts';
import SettingsView from './tabs/settings';
import useConfigStore from './store/configStore';

const App = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const loadFromBackground = useConfigStore(state => state.loadFromBackground);

    useEffect(() => {
        loadFromBackground();
    }, [loadFromBackground]);

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
                    <Tab label="Sync" sx={{ flexGrow: 1, maxWidth: 'none' }} />
                    <Tab label="Artefatos" sx={{ flexGrow: 1, maxWidth: 'none' }} />
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
    );
};

export default App;