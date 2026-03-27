import type { HookStatus } from '@/sidebar/types';

export interface HeaderProps {
    serverStatus: string;
    isChecking: boolean;
    handleFetchArtifacts: (silent?: boolean) => void;
    loading: boolean;
    handleOpenCmdDialog: () => void;
    removeComments: boolean;
    setRemoveComments: (value: boolean) => void;
    historyLength: number;
    currentHistoryIndex: number;
    handlePrevHistory: () => void;
    handleNextHistory: () => void;
    hookStatus: HookStatus;
}