import type { Artifact } from '@/sidebar/types';

export interface ArtifactListProps {
    fetching: boolean;
    artifacts: Artifact[];
    filesToDelete: string[];
    selectedIndices: Set<number>;
    selectedDeletions: Set<string>;
    toggleSelection: (i: number) => void;
    toggleDeleteSelection: (p: string) => void;
    handleDeselectAll: () => void;
    handleApplyAll: () => void;
    actionLoading: boolean;
    serverStatus: string;
}