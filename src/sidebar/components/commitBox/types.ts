export interface CommitBoxProps {
    commitType: string;
    setCommitType: (v: string) => void;
    translateCommit: boolean;
    setTranslateCommit: (v: boolean) => void;
    commitMessage: string;
    setCommitMessage: (v: string) => void;
    originalCommitMessage: string;
    originalCommitType: string;
    handleCommit: () => void;
    actionLoading: boolean;
    serverStatus: string;
}