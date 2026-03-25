import { persist } from 'zustand/middleware';
import { create } from 'zustand';

const MAX_AGE = 10800000;

const useHistoryStore = create(
    persist(
        (set, get) => ({
            histories: {},
            addSnapshot: async (url, snapshot) => {
                const serializedSnapshot = {
                    ...snapshot,
                    selectedIndices: Array.from(snapshot.selectedIndices || []),
                    selectedDeletions: Array.from(snapshot.selectedDeletions || [])
                };

                const msgUint8 = new TextEncoder().encode(JSON.stringify(serializedSnapshot));
                const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const snapshotHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                set((state) => {
                    const now = Date.now();
                    const currentHistory = state.histories[url] || { snapshots: [], currentIndex: -1 };
                    const nextSnapshots = currentHistory.snapshots.slice(0, currentHistory.currentIndex + 1);
                    const lastSnapshot = nextSnapshots.length > 0 ? nextSnapshots[nextSnapshots.length - 1] : null;

                    if (lastSnapshot?.hash === snapshotHash) {
                        return {
                            histories: {
                                ...state.histories,
                                [url]: {
                                    ...currentHistory,
                                    timestamp: now
                                }
                            }
                        };
                    }

                    nextSnapshots.push({ ...serializedSnapshot, hash: snapshotHash });

                    return {
                        histories: {
                            ...state.histories,
                            [url]: {
                                snapshots: nextSnapshots,
                                currentIndex: nextSnapshots.length - 1,
                                timestamp: now
                            }
                        }
                    };
                });
            },
            setHistoryIndex: (url, index) => set((state) => {
                const currentHistory = state.histories[url];
                if (!currentHistory) return state;
                return {
                    histories: {
                        ...state.histories,
                        [url]: {
                            ...currentHistory,
                            currentIndex: index,
                            timestamp: Date.now()
                        }
                    }
                };
            }),
            getHistory: (url) => {
                const history = get().histories[url];
                if (!history) return { snapshots: [], currentIndex: -1 };
                const deserializedSnapshots = history.snapshots.map(snap => ({
                    ...snap,
                    selectedIndices: new Set(snap.selectedIndices),
                    selectedDeletions: new Set(snap.selectedDeletions)
                }));
                return {
                    ...history,
                    snapshots: deserializedSnapshots
                };
            },
            cleanExpired: () => set((state) => {
                const now = Date.now();
                const newHistories = { ...state.histories };
                let hasChanges = false;
                Object.keys(newHistories).forEach(url => {
                    if (now - newHistories[url].timestamp > MAX_AGE) {
                        delete newHistories[url];
                        hasChanges = true;
                    }
                });
                return hasChanges ? { histories: newHistories } : state;
            }),
            clearAllHistory: () => set({ histories: {} })
        }),
        {
            name: 'codemerge-history-storage',
            version: 1
        }
    )
);

export default useHistoryStore;