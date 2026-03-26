import type { HookStatus } from '@/sidebar/types';

export interface HeaderProps {
    serverStatus: string;
    isChecking: boolean;
    handleFetchArtifacts: (s?: boolean) => void;
    loading: boolean;
    handleOpenCmdDialog: () => void;
    removeComments: boolean;
    setRemoveComments: (v: boolean) => void;
    historyLength: number;
    currentHistoryIndex: number;
    handlePrevHistory: () => void;
    handleNextHistory: () => void;
    hookStatus: HookStatus;
}