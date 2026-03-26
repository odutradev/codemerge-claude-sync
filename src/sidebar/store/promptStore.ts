import { persist } from 'zustand/middleware';
import { create } from 'zustand';

import type { Preset } from '@/sidebar/types';

interface PromptState { presets: Preset[]; }
interface PromptActions { addPreset: (preset: Omit<Preset, 'id'>) => void; updatePreset: (id: string, updated: Partial<Preset>) => void; deletePreset: (id: string) => void; }

const usePromptStore = create<PromptState & PromptActions>()(persist((set) => ({
    presets: [],
    addPreset: (preset) => set((state) => ({ presets: [...state.presets, { ...preset, id: crypto.randomUUID() }] })),
    updatePreset: (id, updated) => set((state) => ({ presets: state.presets.map((p) => (p.id === id ? { ...p, ...updated } : p)) })),
    deletePreset: (id) => set((state) => ({ presets: state.presets.filter((p) => p.id !== id) }))
}), { name: 'codemerge-prompt-storage', version: 1 }));

export default usePromptStore;