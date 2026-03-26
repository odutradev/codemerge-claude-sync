import { useState, useEffect, useMemo, lazy, Suspense, StrictMode } from 'react';
import { useMediaQuery, CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom/client';

import { NavigationTabs } from '@/sidebar/components/navigationTabs';
import { FallbackLoader } from '@/sidebar/components/fallbackLoader';
import useSelectionStore from '@/sidebar/store/selectionStore';
import { TabPanel } from '@/sidebar/components/tabPanel';
import useConfigStore from '@/sidebar/store/configStore';
import { getAppTheme } from '@/sidebar/styles/theme';

const ArtifactsView = lazy(() => import('@/sidebar/tabs/artifacts'));
const SettingsView = lazy(() => import('@/sidebar/tabs/settings'));
const ToolsView = lazy(() => import('@/sidebar/tabs/tools'));
const SyncView = lazy(() => import('@/sidebar/tabs/sync'));

const App = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const { loadFromBackground, themeMode, primaryColor } = useConfigStore();
    const { checkExpiration } = useSelectionStore();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        loadFromBackground();
        checkExpiration();
    }, [loadFromBackground, checkExpiration]);

    const theme = useMemo(() => getAppTheme(themeMode, primaryColor, prefersDarkMode), [themeMode, primaryColor, prefersDarkMode]);

    const fetchViaBackground = (url, options = {}) => new Promise((resolve) => {
        if (chrome?.runtime) {
            chrome.runtime.sendMessage({ type: 'FETCH_URL', url, options }, resolve);
            return;
        }
        resolve({ success: false, error: 'Chrome Runtime não disponível' });
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', color: 'text.primary' }}>
                <NavigationTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
                
                <TabPanel currentTab={currentTab} index={0}>
                    <Suspense fallback={<FallbackLoader />}><SyncView fetchViaBackground={fetchViaBackground} /></Suspense>
                </TabPanel>
                
                <TabPanel currentTab={currentTab} index={1}>
                    <Suspense fallback={<FallbackLoader />}><ArtifactsView fetchViaBackground={fetchViaBackground} /></Suspense>
                </TabPanel>
                
                <TabPanel currentTab={currentTab} index={2}>
                    <Suspense fallback={<FallbackLoader />}><ToolsView fetchViaBackground={fetchViaBackground} /></Suspense>
                </TabPanel>
                
                <TabPanel currentTab={currentTab} index={3}>
                    <Suspense fallback={<FallbackLoader />}><SettingsView /></Suspense>
                </TabPanel>
            </Box>
        </ThemeProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);