import { persist } from 'zustand/middleware';
import { create } from 'zustand';

import { DEFAULT_SELECTION_STATE, MAX_SELECTION_AGE } from './defaultValues';

import type { SelectionState, SelectionActions } from './types';

const useSelectionStore = create<SelectionState & SelectionActions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SELECTION_STATE,
      setActiveProjectId: (id) => set({ activeProjectId: id }),
      addPathsToSelection: (projectId, paths) => set((state) => {
        const current = new Set(state.selections[projectId] || []);
        paths.forEach((p) => current.add(p));

        return {
          selections: { ...state.selections, [projectId]: Array.from(current) },
          timestamps: { ...state.timestamps, [projectId]: Date.now() }
        };
      }),
      toggleSelection: (projectId, path) => set((state) => {
        const current = new Set(state.selections[projectId] || []);
        current.has(path) ? current.delete(path) : current.add(path);

        return {
          selections: { ...state.selections, [projectId]: Array.from(current) },
          timestamps: { ...state.timestamps, [projectId]: Date.now() }
        };
      }),
      toggleExpansion: (projectId, path) => set((state) => {
        const current = new Set(state.expansions[projectId] || []);
        current.has(path) ? current.delete(path) : current.add(path);

        return {
          expansions: { ...state.expansions, [projectId]: Array.from(current) }
        };
      }),
      togglePin: (projectId, path) => set((state) => {
        const current = new Set(state.pinned[projectId] || []);
        current.has(path) ? current.delete(path) : current.add(path);

        return {
          pinned: { ...state.pinned, [projectId]: Array.from(current) }
        };
      }),
      setProjectSelection: (projectId, paths) => set((state) => ({
        selections: { ...state.selections, [projectId]: Array.from(paths) },
        timestamps: { ...state.timestamps, [projectId]: Date.now() }
      })),
      clearProjectSelection: (projectId) => set((state) => {
        const { [projectId]: _s, ...selections } = state.selections;
        const { [projectId]: _e, ...expansions } = state.expansions;
        const { [projectId]: _t, ...timestamps } = state.timestamps;

        return { selections, expansions, timestamps };
      }),
      clearAllSelections: () => set(DEFAULT_SELECTION_STATE),
      checkExpiration: () => set((state) => {
        const now = Date.now();
        const selections = { ...state.selections };
        const expansions = { ...state.expansions };
        const timestamps = { ...state.timestamps };
        let hasChanges = false;

        Object.keys(selections).forEach((pid) => {
          const ts = timestamps[pid];
          if (!ts) {
            timestamps[pid] = now;
            hasChanges = true;
          } else if (now - ts > MAX_SELECTION_AGE) {
            delete selections[pid];
            delete expansions[pid];
            delete timestamps[pid];
            hasChanges = true;
          }
        });

        return hasChanges ? { selections, expansions, timestamps } : {};
      }),
      hasStoredSelection: (projectId) => {
        const s = get().selections[projectId];
        return !!s && s.length > 0;
      }
    }),
    {
      name: 'codemerge-selection-storage',
      version: 5
    }
  )
);

export default useSelectionStore;