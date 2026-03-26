declare module '@mui/material/styles' {
    interface Palette { fileColors: Record<string, string>; }
    interface PaletteOptions { fileColors?: Record<string, string>; }
}

export type ThemeMode = 'light' | 'system' | 'dark';
export type Verbosity = 'all' | 'errors' | 'silent';
export type ServerStatus = 'connected' | 'disconnected' | 'checking';
export type HookStatus = 'idle' | 'loading' | 'success' | 'error';
export type CommandOutputType = 'commit' | 'execute' | 'hook';

export interface MessageState { open: boolean; text: string; type: 'info' | 'success' | 'warning' | 'error'; }
export interface CommandOutput { type: CommandOutputType; command: string; timestamp: number; success: boolean; output: string | null; error: string | null; status?: string; }
export interface FileNode { path: string; name: string; type: 'file' | 'directory'; children?: FileNode[]; lines?: number; }
export interface Artifact { name: string; code: string; }
export interface Snapshot { commitMessage: string; commitType: string; commandsToExecute: string[]; selectedDeletions: string[]; selectedCommands: string[]; selectedIndices: number[]; filesToDelete: string[]; artifacts: Artifact[]; hash?: string; }
export interface Preset { id: string; title: string; prompt: string; }
export type FetchViaBackground = (url: string, options?: RequestInit) => Promise<any>;