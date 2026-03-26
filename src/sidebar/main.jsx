import { useState, useEffect, useMemo, lazy, Suspense, StrictMode } from 'react';
import { useMediaQuery, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';

import { NavigationTabs } from '@/sidebar/components/navigationTabs';
import { FallbackLoader } from '@/sidebar/components/fallbackLoader';
import useSelectionStore from '@/sidebar/store/selectionStore';
import { TabPanel } from '@/sidebar/components/tabPanel';
import useConfigStore from '@/sidebar/store/configStore';
import { getAppTheme } from '@/sidebar/styles/theme';
import { AppContainer } from './styles';

const ArtifactsView = lazy(() => import('@/sidebar/tabs/artifacts'));
const SettingsView = lazy(() => import('@/sidebar/tabs/settings'));
const ToolsView = lazy(() => import('@/sidebar/tabs/tools'));
const SyncView = lazy(() => import('@/sidebar/tabs/sync'));

const tabsView = [SyncView, ArtifactsView, ToolsView, SettingsView];

const App = () => {
    const { loadFromBackground, themeMode, primaryColor } = useConfigStore();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const { checkExpiration } = useSelectionStore();
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        loadFromBackground();
        checkExpiration();
    }, [loadFromBackground, checkExpiration]);

    const theme = useMemo(() => getAppTheme(themeMode, primaryColor, prefersDarkMode), [themeMode, primaryColor, prefersDarkMode]);

    const fetchViaBackground = (url, options = {}) => new Promise((resolve) => {
        if (chrome?.runtime) return chrome.runtime.sendMessage({ type: 'FETCH_URL', url, options }, resolve);
        return resolve({ success: false, error: 'Chrome Runtime não disponível' });
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppContainer>
                <NavigationTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
                {tabsView.map((View, index) => (
                    <TabPanel key={index} currentTab={currentTab} index={index}>
                        <Suspense fallback={<FallbackLoader />}>
                            <View fetchViaBackground={fetchViaBackground} />
                        </Suspense>
                    </TabPanel>
                ))}
            </AppContainer>
        </ThemeProvider>
    );
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);