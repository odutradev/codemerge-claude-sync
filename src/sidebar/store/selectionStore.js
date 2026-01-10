import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSelectionStore = create(
    persist(
        (set, get) => ({
            selections: {},

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
                    }
                };
            }),

            setProjectSelection: (projectId, paths) => set((state) => ({
                selections: {
                    ...state.selections,
                    [projectId]: Array.isArray(paths) ? paths : Array.from(paths)
                }
            })),

            clearProjectSelection: (projectId) => set((state) => {
                const newSelections = { ...state.selections };
                delete newSelections[projectId];
                return { selections: newSelections };
            }),

            hasStoredSelection: (projectId) => {
                const state = get();
                return state.selections[projectId] && state.selections[projectId].length > 0;
            }
        }),
        {
            name: 'codemerge-selection-storage',
        }
    )
);

export default useSelectionStore;
