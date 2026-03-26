import type { Snapshot } from '@/sidebar/types';

export interface HistoryEntry {
  snapshots: Snapshot[];
  currentIndex: number;
  timestamp?: number;
}

export interface HistoryState {
  histories: Record<string, HistoryEntry>;
}

export interface HistoryActions {
  addSnapshot: (url: string, snapshot: Snapshot) => Promise<void>;
  setHistoryIndex: (url: string, index: number) => void;
  getHistory: (url: string) => HistoryEntry;
  cleanExpired: () => void;
  clearAllHistory: () => void;
}