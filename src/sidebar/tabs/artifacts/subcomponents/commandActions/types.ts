export interface CommandActionsProps {
    commandsToExecute: string[];
    selectedCommands: Set<string>;
    toggleCommandSelection: (command: string) => void;
    handleExecuteCommands: () => void;
    actionLoading: boolean;
    serverStatus: string;
}