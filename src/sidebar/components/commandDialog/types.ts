import type { CommandOutput } from '@/sidebar/types';

export interface CommandDialogProps {
    cmdDialogOpen: boolean;
    setCmdDialogOpen: (v: boolean) => void;
    cmdLoading: boolean;
    cmdOutput: CommandOutput | null;
    handleFetchCommandOutput: () => void;
    handleInjectOutput: () => void;
}