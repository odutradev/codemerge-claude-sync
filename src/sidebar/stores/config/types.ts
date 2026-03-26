import type { ThemeMode, Verbosity } from '@/sidebar/types';

export interface ConfigState {
  serverUrl: string;
  checkInterval: number;
  themeMode: ThemeMode;
  primaryColor: string;
  compactMode: boolean;
  verbosity: Verbosity;
  persistSelection: boolean;
  removeComments: boolean;
  removeEmptyLines: boolean;
  removeLogs: boolean;
  translateCommit: boolean;
  showCommandModal: boolean;
  autoSelectSynced: boolean;
}

export interface ConfigActions {
  setServerUrl: (url: string) => void;
  setCheckInterval: (interval: string | number) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setCompactMode: (mode: boolean) => void;
  setVerbosity: (level: Verbosity) => void;
  setPersistSelection: (enabled: boolean) => void;
  setRemoveComments: (enabled: boolean) => void;
  setRemoveEmptyLines: (enabled: boolean) => void;
  setRemoveLogs: (enabled: boolean) => void;
  setTranslateCommit: (enabled: boolean) => void;
  setShowCommandModal: (enabled: boolean) => void;
  setAutoSelectSynced: (enabled: boolean) => void;
  resetConfig: () => void;
  loadFromBackground: () => void;
  syncToBackground: () => void;
}