import { persist } from 'zustand/middleware';
import { create } from 'zustand';

import { DEFAULT_PROMPT_STATE } from './defaultValues';

import type { PromptState, PromptActions } from './types';

const usePromptStore = create<PromptState & PromptActions>()(persist((set) => ({
    ...DEFAULT_PROMPT_STATE,
    addPreset: (preset) => set((state) => ({ presets: [...state.presets, { ...preset, id: crypto.randomUUID() }] })),
    updatePreset: (id, updated) => set((state) => ({ presets: state.presets.map((p) => (p.id === id ? { ...p, ...updated } : p)) })),
    deletePreset: (id) => set((state) => ({ presets: state.presets.filter((p) => p.id !== id) }))
}), { name: 'codemerge-prompt-storage', version: 1 }));

export default usePromptStore;