import type { ConfigState } from "./types";

export const DEFAULT_CONFIG: ConfigState = {
  serverUrl: "http://localhost:9876",
  checkInterval: 5000,
  themeMode: "system",
  primaryColor: "#da7756",
  compactMode: false,
  verbosity: "all",
  persistSelection: true,
  removeComments: false,
  removeEmptyLines: false,
  removeLogs: false,
  translateCommit: true,
  showCommandModal: true,
  autoSelectSynced: true,
};
