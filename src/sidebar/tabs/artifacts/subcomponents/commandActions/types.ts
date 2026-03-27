export interface CommandActionsProps {
    commandsToExecute: string[];
    selectedCommands: Set<string>;
    toggleCommandSelection: (cmd: string) => void;
    handleExecuteCommands: () => void;
    actionLoading: boolean;
    serverStatus: string;
}