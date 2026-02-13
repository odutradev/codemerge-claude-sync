import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSelectionStore = create(
    persist(
        (set, get) => ({
            selections: {},
            expansions: {},
            timestamps: {},

            toggleSelection: (projectId, path) => set((state) => {
                const currentSelections = new Set(state.selections[projectId] || []);
                if (currentSelections.has(path)) {
                    currentSelections.delete(path);
                } else {
                    currentSelections.add(path);
                }
                return {
                    selections: {
                        ...state.selections,
                        [projectId]: Array.from(currentSelections)
                    },
                    timestamps: {
                        ...state.timestamps,
                        [projectId]: Date.now()
                    }
                };
            }),

            toggleExpansion: (projectId, path) => set((state) => {
                const currentExpansions = new Set(state.expansions[projectId] || []);
                if (currentExpansions.has(path)) {
                    currentExpansions.delete(path);
                } else {
                    currentExpansions.add(path);
                }
                return {
                    expansions: {
                        ...state.expansions,
                        [projectId]: Array.from(currentExpansions)
                    }
                };
            }),

            setProjectSelection: (projectId, paths) => set((state) => ({
                selections: {
                    ...state.selections,
                    [projectId]: Array.isArray(paths) ? paths : Array.from(paths)
                },
                timestamps: {
                    ...state.timestamps,
                    [projectId]: Date.now()
                }
            })),

            clearProjectSelection: (projectId) => set((state) => {
                const newSelections = { ...state.selections };
                const newExpansions = { ...state.expansions };
                const newTimestamps = { ...state.timestamps };
                delete newSelections[projectId];
                delete newExpansions[projectId];
                delete newTimestamps[projectId];
                return {
                    selections: newSelections,
                    expansions: newExpansions,
                    timestamps: newTimestamps
                };
            }),

            clearAllSelections: () => set({
                selections: {},
                expansions: {},
                timestamps: {}
            }),

            checkExpiration: () => set((state) => {
                const now = Date.now();
                const MAX_AGE = 72 * 60 * 60 * 1000;
                const newSelections = { ...state.selections };
                const newExpansions = { ...state.expansions };
                const newTimestamps = { ...state.timestamps };
                let hasChanges = false;

                Object.keys(newSelections).forEach(pid => {
                    const timestamp = newTimestamps[pid];
                    if (!timestamp) {
                        newTimestamps[pid] = now;
                        hasChanges = true;
                    } else if (now - timestamp > MAX_AGE) {
                        delete newSelections[pid];
                        delete newExpansions[pid];
                        delete newTimestamps[pid];
                        hasChanges = true;
                    }
                });

                if (hasChanges) {
                    return {
                        selections: newSelections,
                        expansions: newExpansions,
                        timestamps: newTimestamps
                    };
                }
                return {};
            }),

            hasStoredSelection: (projectId) => {
                const state = get();
                return state.selections[projectId] && state.selections[projectId].length > 0;
            }
        }),
        {
            name: 'codemerge-selection-storage',
            version: 3,
        }
    )
);

export default useSelectionStore;