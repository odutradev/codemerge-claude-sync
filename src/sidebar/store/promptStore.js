import { persist } from 'zustand/middleware';
import { create } from 'zustand';

const usePromptStore = create(
    persist(
        (set) => ({
            presets: [],
            addPreset: (preset) => set((state) => ({ presets: [...state.presets, { ...preset, id: crypto.randomUUID() }] })),
            updatePreset: (id, updated) => set((state) => ({ presets: state.presets.map((p) => (p.id === id ? { ...p, ...updated } : p)) })),
            deletePreset: (id) => set((state) => ({ presets: state.presets.filter((p) => p.id !== id) }))
        }),
        {
            name: 'codemerge-prompt-storage',
            version: 1
        }
    )
);

export default usePromptStore;