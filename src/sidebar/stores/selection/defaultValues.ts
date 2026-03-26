import type { SelectionState } from './types';

export const MAX_SELECTION_AGE = 259200000;
export const DEFAULT_SELECTION_STATE: SelectionState = { selections: {}, expansions: {}, timestamps: {}, pinned: {}, activeProjectId: null };