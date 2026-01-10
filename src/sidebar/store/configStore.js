import { create } from 'zustand';

const useConfigStore = create((set, get) => ({
    serverUrl: 'http://localhost:9876',
    checkInterval: 5000,
    
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

    loadFromBackground: () => {
        if (chrome && chrome.runtime) {
            chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                if (response?.config) {
                    set((state) => ({
                        serverUrl: response.config.serverUrl || state.serverUrl,
                        checkInterval: response.config.checkInterval || state.checkInterval
                    }));
                }
            });
        }
    },

    syncToBackground: () => {
        if (chrome && chrome.runtime) {
            const { serverUrl, checkInterval } = get();
            chrome.runtime.sendMessage({
                type: 'UPDATE_CONFIG',
                config: { serverUrl, checkInterval }
            });
        }
    }
}));

export default useConfigStore;