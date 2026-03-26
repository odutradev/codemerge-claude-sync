import { persist } from 'zustand/middleware';
import { create } from 'zustand';

import type { ThemeMode, Verbosity } from '@/sidebar/types';

interface ConfigState { serverUrl: string; checkInterval: number; themeMode: ThemeMode; primaryColor: string; compactMode: boolean; verbosity: Verbosity; persistSelection: boolean; removeComments: boolean; removeEmptyLines: boolean; removeLogs: boolean; translateCommit: boolean; showCommandModal: boolean; autoSelectSynced: boolean; }
interface ConfigActions { setServerUrl: (url: string) => void; setCheckInterval: (interval: string | number) => void; setThemeMode: (mode: ThemeMode) => void; setPrimaryColor: (color: string) => void; setCompactMode: (mode: boolean) => void; setVerbosity: (level: Verbosity) => void; setPersistSelection: (enabled: boolean) => void; setRemoveComments: (enabled: boolean) => void; setRemoveEmptyLines: (enabled: boolean) => void; setRemoveLogs: (enabled: boolean) => void; setTranslateCommit: (enabled: boolean) => void; setShowCommandModal: (enabled: boolean) => void; setAutoSelectSynced: (enabled: boolean) => void; resetConfig: () => void; loadFromBackground: () => void; syncToBackground: () => void; }

const DEFAULT_CONFIG: ConfigState = { serverUrl: 'http://localhost:9876', checkInterval: 5000, themeMode: 'system', primaryColor: '#da7756', compactMode: false, verbosity: 'all', persistSelection: true, removeComments: false, removeEmptyLines: false, removeLogs: false, translateCommit: true, showCommandModal: true, autoSelectSynced: true };

const useConfigStore = create<ConfigState & ConfigActions>()(persist((set, get) => ({
    ...DEFAULT_CONFIG,
    setServerUrl: (url) => { set({ serverUrl: url }); get().syncToBackground(); },
    setCheckInterval: (interval) => { const val = typeof interval === 'string' ? parseInt(interval, 10) : interval; if (!isNaN(val) && val > 0) { set({ checkInterval: val }); get().syncToBackground(); } },
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
    setAutoSelectSynced: (enabled) => { set({ autoSelectSynced: enabled }); get().syncToBackground(); },
    resetConfig: () => { set(DEFAULT_CONFIG); get().syncToBackground(); },
    loadFromBackground: () => { if (typeof chrome !== 'undefined' && chrome.runtime) { chrome.runtime.sendMessage({ type: 'GET_CONFIG' }, (response) => { if (response?.config) set((state) => ({ ...state, ...response.config })); }); } },
    syncToBackground: () => { if (typeof chrome !== 'undefined' && chrome.runtime) { const { loadFromBackground, syncToBackground, resetConfig, ...config } = get(); chrome.runtime.sendMessage({ type: 'UPDATE_CONFIG', config }); } }
}), { name: 'codemerge-settings-storage', partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['loadFromBackground', 'syncToBackground'].includes(key))) as ConfigState }));

export default useConfigStore;