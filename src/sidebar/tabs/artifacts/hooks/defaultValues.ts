import type { ArtifactsLocalState } from "./types";

export const INITIAL_STATE: ArtifactsLocalState = {
  artifacts: [],
  filesToDelete: [],
  commandsToExecute: [],
  selectedIndices: new Set(),
  selectedDeletions: new Set(),
  selectedCommands: new Set(),
  fetching: false,
  cmdDialogOpen: false,
  cmdOutput: null,
  cmdLoading: false,
  commitMessage: "",
  commitType: "feat",
  originalCommitMessage: "",
  originalCommitType: "feat",
  actionLoading: false,
  hookStatus: "idle",
  activeUrl: null,
};
