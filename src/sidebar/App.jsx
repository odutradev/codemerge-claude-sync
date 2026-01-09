import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import SyncView from './components/SyncView';
import ArtifactsView from './components/ArtifactsView';

const App = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [config, setConfig] = useState({ serverUrl: 'http://localhost:9876' });

    useEffect(() => {
        // Carregar config inicial
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                if (response?.config) {
                    setConfig(prev => ({ ...prev, ...response.config }));
                }
            });
        }
    }, []);

    const handleConfigChange = (newConfig) => {
        const updated = { ...config, ...newConfig };
        setConfig(updated);
        // Persistir
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ type: 'UPDATE_CONFIG', config: updated });
        }
    };

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
                <Tabs value={currentTab} onChange={handleTabChange} aria-label="sidebar tabs" variant="fullWidth" textColor="primary" indicatorColor="primary">
                    <Tab label="Sync" />
                    <Tab label="Artefatos" />
                </Tabs>
            </Box>
            
            <Box role="tabpanel" hidden={currentTab !== 0} sx={{ flexGrow: 1, height: 'calc(100% - 49px)' }}>
                {currentTab === 0 && (
                    <SyncView 
                        config={config} 
                        onConfigChange={handleConfigChange}
                        fetchViaBackground={fetchViaBackground}
                    />
                )}
            </Box>
            
            <Box role="tabpanel" hidden={currentTab !== 1} sx={{ flexGrow: 1, height: 'calc(100% - 49px)' }}>
                {currentTab === 1 && (
                    <ArtifactsView 
                        config={config}
                        fetchViaBackground={fetchViaBackground}
                    />
                )}
            </Box>
        </Box>
    );
};

export default App;