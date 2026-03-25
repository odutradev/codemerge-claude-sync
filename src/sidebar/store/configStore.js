import { persist } from 'zustand/middleware';
import { create } from 'zustand';

const DEFAULT_CONFIG = {
    serverUrl: 'http://localhost:9876',
    checkInterval: 5000,
    themeMode: 'system',
    primaryColor: '#da7756',
    compactMode: false,
    verbosity: 'all',
    persistSelection: true,
    removeComments: false,
    removeEmptyLines: false,
    removeLogs: false,
    translateCommit: true,
    showCommandModal: true
};

const useConfigStore = create(
    persist(
        (set, get) => ({
            ...DEFAULT_CONFIG,
            setServerUrl: (url) => { set({ serverUrl: url }); get().syncToBackground(); },
            setCheckInterval: (interval) => {
                const val = parseInt(interval, 10);
                if (!isNaN(val) && val > 0) { set({ checkInterval: val }); get().syncToBackground(); }
            },
            setThemeMode: (mode) => { set({ themeMode: mode }); get().syncToBackground(); },
            setPrimaryColor: (color) => { set({ primaryColor: color }); get().syncToBackground(); },
            setCompactMode: (mode) => { set({ compactMode: mode }); get().syncToBackground(); },
            setVerbosity: (level) => { set({ verbosity: level }); get().syncToBackground(); },
            setPersistSelection: (enabled) => { set({ persistSelection: enabled }); get().syncToBackground(); },
            setRemoveComments: (enabled) => { set({ removeComments: enabled }); get().syncToBackground(); },
            setRemoveEmptyLines: (enabled) => { set({ removeEmptyLines: enabled }); get().syncToBackground(); },
            setRemoveLogs: (enabled) => { set({ removeLogs: enabled }); get().syncToBackground(); },
            setTranslateCommit: (enabled) => { set({ translateCommit: enabled }); get().syncToBackground(); },
            setShowCommandModal: (enabled) => { set({ showCommandModal: enabled }); get().syncToBackground(); },
            resetConfig: () => { set(DEFAULT_CONFIG); get().syncToBackground(); },
            loadFromBackground: () => {
                if (typeof chrome !== 'undefined' && chrome.runtime) {
                    chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => {
                        if (response?.config) set((state) => ({ ...state, ...response.config }));
                    });
                }
            },
            syncToBackground: () => {
                if (typeof chrome !== 'undefined' && chrome.runtime) {
                    const config = get();
                    chrome.runtime.sendMessage({
                        type: 'UPDATE_CONFIG',
                        config: {
                            serverUrl: config.serverUrl,
                            checkInterval: config.checkInterval,
                            themeMode: config.themeMode,
                            primaryColor: config.primaryColor,
                            compactMode: config.compactMode,
                            verbosity: config.verbosity,
                            persistSelection: config.persistSelection,
                            removeComments: config.removeComments,
                            removeEmptyLines: config.removeEmptyLines,
                            removeLogs: config.removeLogs,
                            translateCommit: config.translateCommit,
                            showCommandModal: config.showCommandModal
                        }
                    });
                }
            }
        }),
        {
            name: 'codemerge-settings-storage',
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(([key]) => !['loadFromBackground', 'syncToBackground'].includes(key))
            ),
        }
    )
);

export default useConfigStore;