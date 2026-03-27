import type { Artifact } from '@/sidebar/types';

export interface ArtifactListProps {
    fetching: boolean;
    artifacts: Artifact[];
    filesToDelete: string[];
    selectedIndices: Set<number>;
    selectedDeletions: Set<string>;
    toggleSelection: (index: number) => void;
    toggleDeleteSelection: (path: string) => void;
    handleDeselectAll: () => void;
    handleApplyAll: () => void;
    actionLoading: boolean;
    serverStatus: string;
}