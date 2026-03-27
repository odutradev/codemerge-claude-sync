import type { CommandOutput, ServerStatus, HookStatus, Artifact } from '@/sidebar/types';

export interface ArtifactsLocalState {
    artifacts: Artifact[];
    filesToDelete: string[];
    commandsToExecute: string[];
    selectedIndices: Set<number>;
    selectedDeletions: Set<string>;
    selectedCommands: Set<string>;
    fetching: boolean;
    cmdDialogOpen: boolean;
    cmdOutput: CommandOutput | null;
    cmdLoading: boolean;
    commitMessage: string;
    commitType: string;
    originalCommitMessage: string;
    originalCommitType: string;
    actionLoading: boolean;
    hookStatus: HookStatus;
    activeUrl: string | null;
}

export interface UseArtifactsReturn {
    state: ArtifactsLocalState & {
        serverStatus: ServerStatus;
        isChecking: boolean;
        removeComments: boolean;
        translateCommit: boolean;
        historyLength: number;
        currentHistoryIndex: number;
    };
    actions: {
        handleFetchArtifacts: (silent?: boolean) => void;
        handleApplyAll: () => void;
        handleExecuteCommands: () => void;
        handleCommit: () => void;
        handleOpenCmdDialog: () => void;
        handleFetchCommandOutput: () => void;
        handleInjectOutput: () => void;
        handleDeselectAll: () => void;
        handlePrevHistory: () => void;
        handleNextHistory: () => void;
        toggleSelection: (i: number) => void;
        toggleDeleteSelection: (p: string) => void;
        toggleCommandSelection: (c: string) => void;
        setField: <K extends keyof ArtifactsLocalState>(k: K, v: ArtifactsLocalState[K]) => void;
        setRemoveComments: (v: boolean) => void;
        setTranslateCommit: (v: boolean) => void;
    };
}