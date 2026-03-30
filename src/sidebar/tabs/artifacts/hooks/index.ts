import { useCallback, useEffect, useState, useRef } from 'react';

import { processCode } from '@/sidebar/utils/codeProcessor';
import { useServerStatus } from '@/sidebar/hooks/useServerStatus';
import useNotificationStore from '@/sidebar/stores/notification';
import useSelectionStore from '@/sidebar/stores/selection';
import useHistoryStore from '@/sidebar/stores/history';
import useConfigStore from '@/sidebar/stores/config';
import INITIAL_STATE from './defaultValues';

import type { UseArtifactsReturn, ArtifactsLocalState } from './types';
import type { FetchViaBackground, Artifact } from '@/sidebar/types';

const useArtifacts = (fetchViaBackground: FetchViaBackground): UseArtifactsReturn => {
    const { serverUrl, checkInterval, removeComments, removeEmptyLines, removeLogs, translateCommit, showCommitFeedback, showExecuteFeedback, autoSelectSynced, setRemoveComments, setTranslateCommit } = useConfigStore();
    const { histories, addSnapshot, setHistoryIndex, cleanExpired, getHistory } = useHistoryStore();
    const { serverStatus, isChecking } = useServerStatus(serverUrl, checkInterval, fetchViaBackground);
    const { activeProjectId, addPathsToSelection } = useSelectionStore();
    const { showNotification } = useNotificationStore();

    const [state, setState] = useState<ArtifactsLocalState>(INITIAL_STATE);
    const autoFetchedUrls = useRef<Set<string>>(new Set());

    const historyData = state.activeUrl ? histories[state.activeUrl] : null;
    const currentHistoryIndex = historyData?.currentIndex ?? -1;
    const historyLength = historyData?.snapshots?.length ?? 0;

    const patchState = (updates: Partial<ArtifactsLocalState>) => {
        setState((prev) => ({
            ...prev,
            ...updates
        }));
    };

    const setField = <K extends keyof ArtifactsLocalState>(key: K, value: ArtifactsLocalState[K]) => {
        setState((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            cleanExpired();

            const tabs = await chrome.tabs.query({
                active: true,
                currentWindow: true
            });

            if (!tabs[0]?.url || !isMounted) return;

            const url = tabs[0].url.split('#')[0];
            patchState({ activeUrl: url });

            const history = getHistory(url);

            if (history.currentIndex < 0) return;

            const snapshot = history.snapshots[history.currentIndex];

            patchState({
                originalCommitMessage: snapshot.commitMessage,
                originalCommitType: snapshot.commitType,
                commandsToExecute: snapshot.commandsToExecute || [],
                selectedDeletions: new Set(snapshot.selectedDeletions),
                selectedCommands: new Set(snapshot.selectedCommands),
                commitMessage: snapshot.commitMessage,
                selectedIndices: new Set(snapshot.selectedIndices),
                filesToDelete: snapshot.filesToDelete,
                commitType: snapshot.commitType,
                artifacts: snapshot.artifacts
            });
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [cleanExpired, getHistory]);

    const handleFetchArtifacts = useCallback(async (silent = false) => {
        patchState({
            actionLoading: true,
            fetching: true
        });

        try {
            const tabs = await chrome.tabs.query({
                active: true,
                currentWindow: true
            });

            if (!tabs[0]) throw new Error('Aba ativa não encontrada');

            const isGemini = tabs[0].url!.includes('gemini.google.com');
            const isClaude = tabs[0].url!.includes('claude.ai');

            if (!isGemini && !isClaude) throw new Error('Esta função requer Gemini ou Claude aberto na aba ativa');

            const url = tabs[0].url!.split('#')[0];

            if (url !== state.activeUrl) patchState({ activeUrl: url });

            const response = await chrome.tabs.sendMessage(tabs[0].id!, {
                type: isGemini ? 'GET_GEMINI_ARTIFACTS' : 'GET_CLAUDE_ARTIFACTS'
            });

            if (!response.success) throw new Error(response.error);

            const rawArtifacts = response.artifacts ?? [];
            let parsedCommandsToExecute: string[] = [];
            let parsedFilesToDelete: string[] = [];
            let parsedCommitType = 'feat';
            let parsedCommitMsg = '';

            const filteredArtifacts = rawArtifacts.filter((artifact: Artifact) => {
                if (artifact.name === 'codemerge.result.json') {
                    try {
                        const parsed = JSON.parse(artifact.code);
                        parsedCommandsToExecute = parsed.commandsToExecute ?? [];
                        parsedFilesToDelete = parsed.filesToDelete ?? [];
                        parsedCommitType = parsed.commitType ?? 'feat';
                        parsedCommitMsg = parsed.commitMessage ?? '';
                    } catch {
                        return false;
                    }
                    return false;
                }
                return true;
            });

            const initialSelection = new Set<number>();

            filteredArtifacts.forEach((artifact: Artifact, index: number) => {
                if (!artifact.name.toLowerCase().endsWith('.md')) {
                    initialSelection.add(index);
                }
            });

            const newDeletions = new Set(parsedFilesToDelete);
            const newCommands = new Set(parsedCommandsToExecute);

            patchState({
                originalCommitMessage: parsedCommitMsg,
                commandsToExecute: parsedCommandsToExecute,
                originalCommitType: parsedCommitType,
                selectedDeletions: newDeletions,
                selectedCommands: newCommands,
                commitMessage: parsedCommitMsg,
                selectedIndices: initialSelection,
                filesToDelete: parsedFilesToDelete,
                commitType: parsedCommitType,
                artifacts: filteredArtifacts
            });

            await addSnapshot(url, {
                commandsToExecute: parsedCommandsToExecute,
                selectedDeletions: Array.from(newDeletions),
                selectedCommands: Array.from(newCommands),
                filesToDelete: parsedFilesToDelete,
                commitMessage: parsedCommitMsg,
                selectedIndices: Array.from(initialSelection),
                commitType: parsedCommitType,
                artifacts: filteredArtifacts
            });

            if (!silent) showNotification(`${filteredArtifacts.length} artefatos encontrados`, 'success');
        } catch (error) {
            if (!silent) {
                const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
                showNotification(`Erro: ${errorMessage}`, 'error');
            }
        } finally {
            patchState({
                actionLoading: false,
                fetching: false
            });
        }
    }, [state.activeUrl, showNotification, addSnapshot]);

    const applySnapshot = useCallback((index: number) => {
        if (!state.activeUrl) return;

        const history = getHistory(state.activeUrl);
        const snapshot = history.snapshots[index];

        if (!snapshot) return;

        setHistoryIndex(state.activeUrl, index);

        patchState({
            originalCommitMessage: snapshot.commitMessage,
            originalCommitType: snapshot.commitType,
            commandsToExecute: snapshot.commandsToExecute || [],
            selectedDeletions: new Set(snapshot.selectedDeletions),
            selectedCommands: new Set(snapshot.selectedCommands),
            commitMessage: snapshot.commitMessage,
            selectedIndices: new Set(snapshot.selectedIndices),
            filesToDelete: snapshot.filesToDelete,
            commitType: snapshot.commitType,
            artifacts: snapshot.artifacts
        });
    }, [state.activeUrl, getHistory, setHistoryIndex]);

    const handlePrevHistory = useCallback(() => {
        if (currentHistoryIndex > 0) applySnapshot(currentHistoryIndex - 1);
    }, [currentHistoryIndex, applySnapshot]);

    const handleNextHistory = useCallback(() => {
        if (currentHistoryIndex < historyLength - 1) applySnapshot(currentHistoryIndex + 1);
    }, [currentHistoryIndex, historyLength, applySnapshot]);

    useEffect(() => {
        const canFetch = serverStatus === 'connected' && historyLength === 0 && state.activeUrl && !state.fetching;

        if (canFetch && !autoFetchedUrls.current.has(state.activeUrl as string)) {
            autoFetchedUrls.current.add(state.activeUrl as string);
            handleFetchArtifacts(true);
        }
    }, [serverStatus, historyLength, state.activeUrl, state.fetching, handleFetchArtifacts]);

    const handleCommit = async () => {
        if (!state.commitMessage.trim()) return showNotification('Mensagem de commit vazia', 'warning');

        patchState({ actionLoading: true, hookStatus: 'loading' });

        try {
            const response = await fetchViaBackground(`${serverUrl}/commit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    basePath: './',
                    type: state.commitType,
                    message: state.commitMessage,
                    translate: translateCommit
                })
            });

            if (!response.success) throw new Error(`Commit: ${response.error}`);

            const data = response.data ? JSON.parse(response.data) : {};
            const success = data.success ?? true;

            patchState({
                originalCommitMessage: state.commitMessage,
                originalCommitType: state.commitType,
                hookStatus: success ? 'success' : 'error',
                commitMessage: '',
                cmdOutput: {
                    type: 'commit',
                    command: `git commit -m "${state.commitType}: ${state.commitMessage}"`,
                    timestamp: Date.now(),
                    success,
                    output: data.output ?? 'Commit executado sem retorno de texto.',
                    error: data.error ?? null
                }
            });

            showNotification('Commit realizado com sucesso!', 'success');

            if (showCommitFeedback) {
                patchState({ cmdDialogOpen: true, hookStatus: 'idle' });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            showNotification(`Erro ao commitar: ${errorMessage}`, 'error');

            patchState({
                hookStatus: 'error',
                cmdOutput: {
                    type: 'commit',
                    command: `git commit -m "${state.commitType}: ${state.commitMessage}"`,
                    timestamp: Date.now(),
                    success: false,
                    output: null,
                    error: errorMessage
                }
            });

            if (showCommitFeedback) {
                patchState({ cmdDialogOpen: true, hookStatus: 'idle' });
            }
        } finally {
            patchState({ actionLoading: false });
        }
    };

    const handleExecuteCommands = async () => {
        if (state.selectedCommands.size === 0) return showNotification('Nenhum comando selecionado', 'warning');

        patchState({ actionLoading: true, hookStatus: 'loading' });

        try {
            const response = await fetchViaBackground(`${serverUrl}/execute-commands`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    basePath: './',
                    commandsToExecute: Array.from(state.selectedCommands)
                })
            });

            if (!response.success) throw new Error(`Execução: ${response.error}`);

            const data = response.data ? JSON.parse(response.data) : {};
            const success = data.success ?? true;

            showNotification('Comandos enviados para execução!', 'success');

            patchState({
                hookStatus: success ? 'success' : 'error',
                cmdOutput: {
                    type: 'execute',
                    command: 'Múltiplos comandos',
                    timestamp: Date.now(),
                    success,
                    output: JSON.stringify(data.results, null, 2),
                    error: data.error ?? null
                }
            });

            if (showExecuteFeedback) {
                patchState({ cmdDialogOpen: true, hookStatus: 'idle' });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            showNotification(`Erro: ${errorMessage}`, 'error');

            patchState({
                hookStatus: 'error',
                cmdOutput: {
                    type: 'execute',
                    command: 'Falha na execução',
                    timestamp: Date.now(),
                    success: false,
                    output: null,
                    error: errorMessage
                }
            });

            if (showExecuteFeedback) {
                patchState({ cmdDialogOpen: true, hookStatus: 'idle' });
            }
        } finally {
            patchState({ actionLoading: false });
        }
    };

    const handleApplyAll = async () => {
        patchState({
            actionLoading: true,
            hookStatus: 'loading'
        });

        try {
            const tasks: Promise<unknown>[] = [];

            if (state.selectedIndices.size > 0) {
                const selectedFiles = Array.from(state.selectedIndices).map((index) => ({
                    path: state.artifacts[index].name,
                    content: removeComments ? processCode(state.artifacts[index].code, {
                        removeComments: true,
                        removeEmptyLines,
                        removeLogs
                    }) : state.artifacts[index].code
                }));

                tasks.push(fetchViaBackground(`${serverUrl}/upsert`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ files: selectedFiles })
                }));

                if (autoSelectSynced && activeProjectId) {
                    addPathsToSelection(activeProjectId, selectedFiles.map((file) => file.path));
                }
            }

            if (state.selectedDeletions.size > 0) {
                tasks.push(fetchViaBackground(`${serverUrl}/delete-files`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        basePath: './',
                        files: Array.from(state.selectedDeletions)
                    })
                }));

                patchState({ selectedDeletions: new Set() });
            }

            const results = await Promise.all(tasks);
            const errors = (results as { success: boolean; error?: string }[]).filter((result) => !result.success);

            if (errors.length > 0) throw new Error(errors.map((error) => error.error).join(' | '));

            showNotification('Sincronização e deleções aplicadas!', 'success');
            patchState({ hookStatus: 'success' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            showNotification(`Erro: ${errorMessage}`, 'error');
            patchState({ hookStatus: 'error' });
        } finally {
            patchState({ actionLoading: false });
        }
    };

    const handleFetchCommandOutput = async () => {
        patchState({ cmdLoading: true });

        try {
            const response = await fetchViaBackground(`${serverUrl}/command-output`);

            if (!response.success) throw new Error(response.error);

            patchState({
                cmdOutput: {
                    ...JSON.parse(response.data as string),
                    type: 'hook'
                }
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            showNotification(`Erro ao buscar output: ${errorMessage}`, 'error');

            patchState({
                cmdOutput: {
                    type: 'hook',
                    command: 'fetch',
                    timestamp: Date.now(),
                    success: false,
                    output: null,
                    error: errorMessage
                }
            });
        } finally {
            patchState({ cmdLoading: false });
        }
    };

    const handleOpenCmdDialog = () => {
        patchState({ cmdDialogOpen: true, hookStatus: 'idle' });
        handleFetchCommandOutput();
    };

    const handleInjectOutput = async () => {
        if (!state.cmdOutput) return;

        const isNoCommand = state.cmdOutput.status === 'no_command_executed';
        const formattedStatus = state.cmdOutput.success ? 'SUCCESS' : 'ERROR';
        const contentBody = state.cmdOutput.output ?? state.cmdOutput.error ?? '';

        const content = isNoCommand
            ? 'Nenhum comando foi executado recentemente.'
            : `COMMAND: ${state.cmdOutput.command}\nTIMESTAMP: ${state.cmdOutput.timestamp}\nSTATUS: ${formattedStatus}\n\nOUTPUT:\n${contentBody}`;

        try {
            const tabs = await chrome.tabs.query({
                active: true,
                currentWindow: true
            });

            if (!tabs[0]) throw new Error('Aba não encontrada');

            const response = await chrome.tabs.sendMessage(tabs[0].id!, {
                type: tabs[0].url?.includes('gemini.google.com') ? 'ADD_FILE_GEMINI' : 'ADD_FILE',
                fileName: 'command-output.txt',
                content
            });

            if (!response?.success && response?.error) throw new Error(response.error);

            showNotification('Output inserido no input!', 'success');
            patchState({ cmdDialogOpen: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            showNotification(`Erro ao injetar: ${errorMessage}`, 'error');
        }
    };

    const handleDeselectAll = () => {
        patchState({
            selectedDeletions: new Set(),
            selectedCommands: new Set(),
            selectedIndices: new Set()
        });
    };

    const toggleSelection = (index: number) => {
        setState((prev) => {
            const newSelection = new Set(prev.selectedIndices);
            if (newSelection.has(index)) {
                newSelection.delete(index);
            } else {
                newSelection.add(index);
            }
            return {
                ...prev,
                selectedIndices: newSelection
            };
        });
    };

    const toggleDeleteSelection = (path: string) => {
        setState((prev) => {
            const newSelection = new Set(prev.selectedDeletions);
            if (newSelection.has(path)) {
                newSelection.delete(path);
            } else {
                newSelection.add(path);
            }
            return {
                ...prev,
                selectedDeletions: newSelection
            };
        });
    };

    const toggleCommandSelection = (command: string) => {
        setState((prev) => {
            const newSelection = new Set(prev.selectedCommands);
            if (newSelection.has(command)) {
                newSelection.delete(command);
            } else {
                newSelection.add(command);
            }
            return {
                ...prev,
                selectedCommands: newSelection
            };
        });
    };

    return {
        state: {
            ...state,
            serverStatus,
            isChecking,
            removeComments,
            translateCommit,
            historyLength,
            currentHistoryIndex
        },
        actions: {
            handleFetchArtifacts,
            handleApplyAll,
            handleExecuteCommands,
            handleCommit,
            handleOpenCmdDialog,
            handleFetchCommandOutput,
            handleInjectOutput,
            setField,
            setRemoveComments,
            setTranslateCommit,
            handlePrevHistory,
            handleNextHistory,
            handleDeselectAll,
            toggleSelection,
            toggleDeleteSelection,
            toggleCommandSelection
        }
    };
};

export default useArtifacts;