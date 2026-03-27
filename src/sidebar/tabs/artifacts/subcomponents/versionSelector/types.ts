export interface VersionSelectorProps {
    historyLength: number;
    currentHistoryIndex: number;
    handlePrevHistory: () => void;
    handleNextHistory: () => void;
    loading: boolean;
}