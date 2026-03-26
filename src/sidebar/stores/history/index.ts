import { persist } from 'zustand/middleware';
import { create } from 'zustand';

import { DEFAULT_HISTORY_STATE, MAX_AGE } from './defaultValues';

import type { HistoryState, HistoryActions } from './types';

const useHistoryStore = create<HistoryState & HistoryActions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_HISTORY_STATE,
      addSnapshot: async (url, snapshot) => {
        const serializedSnapshot = {
          ...snapshot,
          selectedDeletions: [...(snapshot.selectedDeletions ?? [])],
          selectedCommands: [...(snapshot.selectedCommands ?? [])],
          selectedIndices: [...(snapshot.selectedIndices ?? [])]
        };

        const msgUint8 = new TextEncoder().encode(JSON.stringify(serializedSnapshot));
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const snapshotHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        set((state) => {
          const now = Date.now();
          const currentHistory = state.histories[url] ?? { snapshots: [], currentIndex: -1 };
          const nextSnapshots = currentHistory.snapshots.slice(0, currentHistory.currentIndex + 1);

          if (nextSnapshots.length > 0 && nextSnapshots[nextSnapshots.length - 1].hash === snapshotHash) {
            return {
              histories: {
                ...state.histories,
                [url]: { ...currentHistory, timestamp: now }
              }
            };
          }

          return {
            histories: {
              ...state.histories,
              [url]: {
                snapshots: [...nextSnapshots, { ...serializedSnapshot, hash: snapshotHash }],
                currentIndex: nextSnapshots.length,
                timestamp: now
              }
            }
          };
        });
      },
      setHistoryIndex: (url, index) => set((state) => {
        const history = state.histories[url];
        if (!history) return state;

        return {
          histories: {
            ...state.histories,
            [url]: { ...history, currentIndex: index, timestamp: Date.now() }
          }
        };
      }),
      getHistory: (url) => get().histories[url] ?? { snapshots: [], currentIndex: -1 },
      cleanExpired: () => set((state) => {
        const now = Date.now();
        const validEntries = Object.entries(state.histories).filter(
          ([_, history]) => now - (history.timestamp ?? 0) <= MAX_AGE
        );

        if (validEntries.length === Object.keys(state.histories).length) return state;

        return { histories: Object.fromEntries(validEntries) };
      }),
      clearAllHistory: () => set(DEFAULT_HISTORY_STATE)
    }),
    {
      name: 'codemerge-history-storage',
      version: 2
    }
  )
);

export default useHistoryStore;
