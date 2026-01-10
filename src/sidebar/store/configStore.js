import { create } from 'zustand';

const DEFAULT_CONFIG = {
    serverUrl: 'http://localhost:9876',
    checkInterval: 5000,
    themeMode: 'system',
    primaryColor: '#da7756',
    compactMode: false,
    verbosity: 'all',
    persistSelection: true,
};

const useConfigStore = create((set, get) => ({
    ...DEFAULT_CONFIG,
    
    setServerUrl: (url) => {
        set({ serverUrl: url });
        get().syncToBackground();
    },

    setCheckInterval: (interval) => {
        const val = parseInt(interval, 10);
        if (!isNaN(val) && val > 0) {
            set({ checkInterval: val });
            get().syncToBackground();
        }
    },

    setThemeMode: (mode) => {
        set({ themeMode: mode });
        get().syncToBackground();
    },

    setPrimaryColor: (color) => {
        set({ primaryColor: color });
        get().syncToBackground();
    },

    setCompactMode: (mode) => {
        set({ compactMode: mode });
        get().syncToBackground();
    },

    setVerbosity: (level) => {
        set({ verbosity: level });
        get().syncToBackground();
    },

    setPersistSelection: (enabled) => {
        set({ persistSelection: enabled });
        get().syncToBackground();
    },

    resetConfig: () => {
        set(DEFAULT_CONFIG);
        get().syncToBackground();
    },

    loadFromBackground: () => {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                if (response?.config) {
                    set((state) => ({
                        serverUrl: response.config.serverUrl || state.serverUrl,
                        checkInterval: response.config.checkInterval || state.checkInterval,
                        themeMode: response.config.themeMode || state.themeMode,
                        primaryColor: response.config.primaryColor || state.primaryColor,
                        compactMode: response.config.compactMode ?? state.compactMode,
                        verbosity: response.config.verbosity || state.verbosity,
                        persistSelection: response.config.persistSelection ?? state.persistSelection
                    }));
                }
            });
        }
    },

    syncToBackground: () => {
        if (chrome && chrome.runtime) {
            const { serverUrl, checkInterval, themeMode, primaryColor, compactMode, verbosity, persistSelection } = get();
            chrome.runtime.sendMessage({
                type: 'UPDATE_CONFIG',
                config: { serverUrl, checkInterval, themeMode, primaryColor, compactMode, verbosity, persistSelection }
            });
        }
    }
}));

export default useConfigStore;
