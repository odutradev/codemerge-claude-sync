import type { CommandOutput, MessageState, ServerStatus } from '@/sidebar/types';

export interface UseToolsReturn {
    state: {
        serverStatus: ServerStatus;
        cmdDialogOpen: boolean;
        actionLoading: boolean;
        commitMessage: string;
        cmdLoading: boolean;
        commitType: string;
        cmdOutput: CommandOutput | null;
        message: MessageState;
        translateCommit: boolean;
        originalCommitMessage: string;
        originalCommitType: string;
    };
    actions: {
        setCmdDialogOpen: (v: boolean) => void;
        setCommitMessage: (v: string) => void;
        setCommitType: (v: string) => void;
        setMessage: (m: MessageState) => void;
        setTranslateCommit: (v: boolean) => void;
        handleCommit: () => void;
        handleFetchCommandOutput: () => void;
        handleInjectOutput: () => void;
        showNotification: (text: string, type?: MessageState['type']) => void;
    };
}