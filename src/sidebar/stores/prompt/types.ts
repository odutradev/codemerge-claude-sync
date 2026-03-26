import type { Preset } from '@/sidebar/types';

export interface PromptState {
  presets: Preset[];
}

export interface PromptActions {
  addPreset: (preset: Omit<Preset, 'id'>) => void;
  updatePreset: (id: string, updated: Partial<Preset>) => void;
  deletePreset: (id: string) => void;
}