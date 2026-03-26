import type { CommandOutput, MessageState, Artifact, HookStatus, ServerStatus } from '@/sidebar/types';

export interface UseArtifactsReturn {
    state: {
        artifacts: Artifact[];
        filesToDelete: string[];
        commandsToExecute: string[];
        selectedIndices: Set<number>;
        selectedDeletions: Set<string>;
        selectedCommands: Set<string>;
        fetching: boolean;
        serverStatus: ServerStatus;
        isChecking: boolean;
        cmdDialogOpen: boolean;
        cmdOutput: CommandOutput | null;
        cmdLoading: boolean;
        message: MessageState;
        removeComments: boolean;
        commitMessage: string;
        commitType: string;
        translateCommit: boolean;
        originalCommitMessage: string;
        originalCommitType: string;
        actionLoading: boolean;
        historyLength: number;
        currentHistoryIndex: number;
        hookStatus: HookStatus;
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
        setCmdDialogOpen: (v: boolean) => void;
        toggleSelection: (i: number) => void;
        toggleDeleteSelection: (p: string) => void;
        toggleCommandSelection: (c: string) => void;
        setRemoveComments: (v: boolean) => void;
        setMessage: (m: MessageState) => void;
        setCommitMessage: (m: string) => void;
        setCommitType: (t: string) => void;
        setTranslateCommit: (v: boolean) => void;
    };
}