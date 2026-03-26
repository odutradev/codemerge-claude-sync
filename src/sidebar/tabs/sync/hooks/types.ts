import type { FileNode, MessageState, ServerStatus } from '@/sidebar/types';

export interface UseSyncReturn {
    state: {
        projectStructure: FileNode | null;
        searchTerm: string;
        loading: boolean;
        message: MessageState;
        serverStatus: ServerStatus;
        isChecking: boolean;
        isCopyMode: boolean;
        selectedPaths: Set<string>;
        expandedPaths: Set<string>;
        pinnedPaths: Set<string>;
        stats: { files: number; lines: number; lastUpdate: string };
        serverUrl: string;
        persistSelection: boolean;
    };
    actions: {
        setSearchTerm: (s: string) => void;
        setIsCopyMode: (m: boolean) => void;
        handleCopyPath: (p: string) => void;
        handleToggleSelection: (n: FileNode, s: boolean) => void;
        handleToggleExpansion: (p: string) => void;
        handleTogglePin: (p: string) => void;
        handleFetchStructure: () => void;
        handleSync: () => void;
        setServerUrl: (u: string) => void;
        setPersistSelection: (p: boolean) => void;
        setMessage: (m: MessageState) => void;
    };
}