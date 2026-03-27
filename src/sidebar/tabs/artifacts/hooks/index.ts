import { useCallback, useEffect, useState, useRef } from 'react';

import { useServerStatus } from '@/sidebar/hooks/useServerStatus';
import useNotificationStore from '@/sidebar/stores/notification';
import { processCode } from '@/sidebar/utils/codeProcessor';
import useSelectionStore from '@/sidebar/stores/selection';
import useHistoryStore from '@/sidebar/stores/history';
import useConfigStore from '@/sidebar/stores/config';

import { INITIAL_STATE } from './defaultValues';

import type { UseArtifactsReturn, ArtifactsLocalState } from './types';
import type { FetchViaBackground, Artifact } from '@/sidebar/types';

export const useArtifacts = (fetchViaBackground: FetchViaBackground): UseArtifactsReturn => {
    const { serverUrl, checkInterval, removeComments, removeEmptyLines, removeLogs, translateCommit, showCommandModal, autoSelectSynced, setRemoveComments, setTranslateCommit } = useConfigStore();
    const { histories, addSnapshot, setHistoryIndex, cleanExpired, getHistory } = useHistoryStore();
    const { serverStatus, isChecking } = useServerStatus(serverUrl, checkInterval, fetchViaBackground);
    const { activeProjectId, addPathsToSelection } = useSelectionStore();
    const { showNotification } = useNotificationStore();

    const [state, setState] = useState<ArtifactsLocalState>(INITIAL_STATE);
    const autoFetchedUrls = useRef<Set<string>>(new Set());

    const historyData = state.activeUrl ? histories[state.activeUrl] : null;
    const currentHistoryIndex = historyData?.currentIndex ?? -1;
    const historyLength = historyData?.snapshots?.length ?? 0;

    const patchState = (u: Partial<ArtifactsLocalState>) => setState(p => ({ ...p, ...u }));
    const setField = <K extends keyof ArtifactsLocalState>(k: K, v: ArtifactsLocalState[K]) => setState(p => ({ ...p, [k]: v }));

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            cleanExpired();
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tabs[0]?.url || !isMounted) return;
            const url = tabs[0].url.split('#')[0];
            patchState({ activeUrl: url });
            const history = getHistory(url);
            if (history.currentIndex < 0) return;
            const snap = history.snapshots[history.currentIndex];
            patchState({ originalCommitMessage: snap.commitMessage, originalCommitType: snap.commitType, commandsToExecute: snap.commandsToExecute || [], selectedDeletions: new Set(snap.selectedDeletions), selectedCommands: new Set(snap.selectedCommands), commitMessage: snap.commitMessage, selectedIndices: new Set(snap.selectedIndices), filesToDelete: snap.filesToDelete, commitType: snap.commitType, artifacts: snap.artifacts });
        };
        init();
        return () => { isMounted = false; };
    }, [cleanExpired, getHistory]);

    const handleFetchArtifacts = useCallback(async (silent = false) => {
        patchState({ actionLoading: true, fetching: true });
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tabs[0]) throw new Error('Aba ativa não encontrada');
            const isGemini = tabs[0].url!.includes('gemini.google.com');
            const isClaude = tabs[0].url!.includes('claude.ai');
            if (!isGemini && !isClaude) throw new Error('Esta função requer Gemini ou Claude aberto na aba ativa');
            const url = tabs[0].url!.split('#')[0];
            if (url !== state.activeUrl) patchState({ activeUrl: url });
            const res = await chrome.tabs.sendMessage(tabs[0].id!, { type: isGemini ? 'GET_GEMINI_ARTIFACTS' : 'GET_CLAUDE_ARTIFACTS' });
            if (!res.success) throw new Error(res.error);
            const rawArtifacts = res.artifacts ?? [];
            let parsedCommandsToExecute: string[] = [];
            let parsedFilesToDelete: string[] = [];
            let parsedCommitType = 'feat';
            let parsedCommitMsg = '';
            const filteredArtifacts = rawArtifacts.filter((art: Artifact) => {
                if (art.name === 'codemerge.result.json') {
                    try {
                        const parsed = JSON.parse(art.code);
                        parsedCommandsToExecute = parsed.commandsToExecute ?? [];
                        parsedFilesToDelete = parsed.filesToDelete ?? [];
                        parsedCommitType = parsed.commitType ?? 'feat';
                        parsedCommitMsg = parsed.commitMessage ?? '';
                    } catch { return false; }
                    return false;
                }
                return true;
            });
            const initialSelection = new Set<number>();
            filteredArtifacts.forEach((art: Artifact, i: number) => { if (!art.name.toLowerCase().endsWith('.md')) initialSelection.add(i); });
            const newDeletions = new Set(parsedFilesToDelete);
            const newCommands = new Set(parsedCommandsToExecute);
            patchState({ originalCommitMessage: parsedCommitMsg, commandsToExecute: parsedCommandsToExecute, originalCommitType: parsedCommitType, selectedDeletions: newDeletions, selectedCommands: newCommands, commitMessage: parsedCommitMsg, selectedIndices: initialSelection, filesToDelete: parsedFilesToDelete, commitType: parsedCommitType, artifacts: filteredArtifacts });
            await addSnapshot(url, { commandsToExecute: parsedCommandsToExecute, selectedDeletions: Array.from(newDeletions), selectedCommands: Array.from(newCommands), filesToDelete: parsedFilesToDelete, commitMessage: parsedCommitMsg, selectedIndices: Array.from(initialSelection), commitType: parsedCommitType, artifacts: filteredArtifacts });
            if (!silent) showNotification(`${filteredArtifacts.length} artefatos encontrados`, 'success');
        } catch (error) {
            if (!silent) showNotification(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error');
        } finally {
            patchState({ actionLoading: false, fetching: false });
        }
    }, [state.activeUrl, showNotification, addSnapshot]);

    const applySnapshot = useCallback((index: number) => {
        if (!state.activeUrl) return;
        const history = getHistory(state.activeUrl);
        const snap = history.snapshots[index];
        if (!snap) return;
        setHistoryIndex(state.activeUrl, index);
        patchState({ originalCommitMessage: snap.commitMessage, originalCommitType: snap.commitType, commandsToExecute: snap.commandsToExecute || [], selectedDeletions: new Set(snap.selectedDeletions), selectedCommands: new Set(snap.selectedCommands), commitMessage: snap.commitMessage, selectedIndices: new Set(snap.selectedIndices), filesToDelete: snap.filesToDelete, commitType: snap.commitType, artifacts: snap.artifacts });
    }, [state.activeUrl, getHistory, setHistoryIndex]);

    const handlePrevHistory = useCallback(() => { if (currentHistoryIndex > 0) applySnapshot(currentHistoryIndex - 1); }, [currentHistoryIndex, applySnapshot]);
    const handleNextHistory = useCallback(() => { if (currentHistoryIndex < historyLength - 1) applySnapshot(currentHistoryIndex + 1); }, [currentHistoryIndex, historyLength, applySnapshot]);

    useEffect(() => {
        if (serverStatus === 'connected' && historyLength === 0 && state.activeUrl && !state.fetching && !autoFetchedUrls.current.has(state.activeUrl)) {
            autoFetchedUrls.current.add(state.activeUrl);
            handleFetchArtifacts(true);
        }
    }, [serverStatus, historyLength, state.activeUrl, state.fetching, handleFetchArtifacts]);

    const handleCommit = async () => {
        if (!state.commitMessage.trim()) return showNotification('Mensagem de commit vazia', 'warning');
        patchState({ actionLoading: true });
        try {
            const res = await fetchViaBackground(`${serverUrl}/commit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', type: state.commitType, message: state.commitMessage, translate: translateCommit }) });
            if (!res.success) throw new Error(`Commit: ${res.error}`);
            const data = res.data ? JSON.parse(res.data) : {};
            patchState({ originalCommitMessage: state.commitMessage, originalCommitType: state.commitType, commitMessage: '' });
            showNotification('Commit realizado com sucesso!', 'success');
            patchState({ cmdOutput: { type: 'commit', command: `git commit -m "${state.commitType}: ${state.commitMessage}"`, timestamp: Date.now(), success: data.success ?? true, output: data.output ?? 'Commit executado sem retorno de texto.', error: data.error ?? null } });
            if (showCommandModal) patchState({ cmdDialogOpen: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            showNotification(`Erro ao commitar: ${errorMessage}`, 'error');
            patchState({ cmdOutput: { type: 'commit', command: `git commit -m "${state.commitType}: ${state.commitMessage}"`, timestamp: Date.now(), success: false, output: null, error: errorMessage } });
            if (showCommandModal) patchState({ cmdDialogOpen: true });
        } finally {
            patchState({ actionLoading: false });
        }
    };

    const handleExecuteCommands = async () => {
        if (state.selectedCommands.size === 0) return showNotification('Nenhum comando selecionado', 'warning');
        patchState({ actionLoading: true });
        try {
            const res = await fetchViaBackground(`${serverUrl}/execute-commands`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', commandsToExecute: Array.from(state.selectedCommands) }) });
            if (!res.success) throw new Error(`Execução: ${res.error}`);
            const data = res.data ? JSON.parse(res.data) : {};
            showNotification('Comandos enviados para execução!', 'success');
            patchState({ cmdOutput: { type: 'execute', command: 'Múltiplos comandos', timestamp: Date.now(), success: data.success ?? true, output: JSON.stringify(data.results, null, 2), error: data.error ?? null } });
            if (showCommandModal) patchState({ cmdDialogOpen: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            showNotification(`Erro: ${errorMessage}`, 'error');
            patchState({ cmdOutput: { type: 'execute', command: 'Falha na execução', timestamp: Date.now(), success: false, output: null, error: errorMessage } });
            if (showCommandModal) patchState({ cmdDialogOpen: true });
        } finally {
            patchState({ actionLoading: false });
        }
    };

    const handleApplyAll = async () => {
        patchState({ actionLoading: true, hookStatus: 'loading' });
        try {
            const tasks: Promise<unknown>[] = [];
            if (state.selectedIndices.size > 0) {
                const selectedFiles = Array.from(state.selectedIndices).map(i => ({ path: state.artifacts[i].name, content: removeComments ? processCode(state.artifacts[i].code, { removeComments: true, removeEmptyLines, removeLogs }) : state.artifacts[i].code }));
                tasks.push(fetchViaBackground(`${serverUrl}/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ files: selectedFiles }) }));
                if (autoSelectSynced && activeProjectId) addPathsToSelection(activeProjectId, selectedFiles.map(f => f.path));
            }
            if (state.selectedDeletions.size > 0) {
                tasks.push(fetchViaBackground(`${serverUrl}/delete-files`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', files: Array.from(state.selectedDeletions) }) }));
                patchState({ selectedDeletions: new Set() });
            }
            const results = await Promise.all(tasks);
            const errors = (results as { success: boolean; error?: string }[]).filter(r => !r.success);
            if (errors.length > 0) throw new Error(errors.map(e => e.error).join(' | '));
            showNotification('Sincronização e deleções aplicadas!', 'success');
            patchState({ hookStatus: 'success' });
        } catch (error) {
            showNotification(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error');
            patchState({ hookStatus: 'error' });
        } finally {
            patchState({ actionLoading: false });
            setTimeout(() => setState(p => ({ ...p, hookStatus: p.hookStatus !== 'loading' ? 'idle' : p.hookStatus })), 4000);
        }
    };

    const handleFetchCommandOutput = async () => {
        patchState({ cmdLoading: true });
        try {
            const res = await fetchViaBackground(`${serverUrl}/command-output`);
            if (!res.success) throw new Error(res.error);
            patchState({ cmdOutput: { ...JSON.parse(res.data), type: 'hook' } });
        } catch (error) {
            showNotification(`Erro ao buscar output: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error');
            patchState({ cmdOutput: { type: 'hook', command: 'fetch', timestamp: Date.now(), success: false, output: null, error: error instanceof Error ? error.message : 'Erro desconhecido' } });
        } finally {
            patchState({ cmdLoading: false });
        }
    };

    const handleOpenCmdDialog = () => {
        patchState({ cmdDialogOpen: true });
        handleFetchCommandOutput();
    };

    const handleInjectOutput = async () => {
        if (!state.cmdOutput) return;
        const content = state.cmdOutput.status === 'no_command_executed' ? 'Nenhum comando foi executado recentemente.' : `COMMAND: ${state.cmdOutput.command}\nTIMESTAMP: ${state.cmdOutput.timestamp}\nSTATUS: ${state.cmdOutput.success ? 'SUCCESS' : 'ERROR'}\n\nOUTPUT:\n${state.cmdOutput.output ?? state.cmdOutput.error ?? ''}`;
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tabs[0]) throw new Error('Aba não encontrada');
            const res = await chrome.tabs.sendMessage(tabs[0].id!, { type: tabs[0].url?.includes('gemini.google.com') ? 'ADD_FILE_GEMINI' : 'ADD_FILE', fileName: 'command-output.txt', content });
            if (!res?.success && res?.error) throw new Error(res.error);
            showNotification('Output inserido no input!', 'success');
            patchState({ cmdDialogOpen: false });
        } catch (error) {
            showNotification(`Erro ao injetar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error');
        }
    };

    return {
        state: { ...state, serverStatus, isChecking, removeComments, translateCommit, historyLength, currentHistoryIndex },
        actions: {
            handleFetchArtifacts, handleApplyAll, handleExecuteCommands, handleCommit, handleOpenCmdDialog, handleFetchCommandOutput, handleInjectOutput, setField, setRemoveComments, setTranslateCommit, handlePrevHistory, handleNextHistory,
            handleDeselectAll: () => patchState({ selectedDeletions: new Set(), selectedCommands: new Set(), selectedIndices: new Set() }),
            toggleSelection: (i: number) => setState(p => { const n = new Set(p.selectedIndices); n.has(i) ? n.delete(i) : n.add(i); return { ...p, selectedIndices: n }; }),
            toggleDeleteSelection: (p: string) => setState(pr => { const n = new Set(pr.selectedDeletions); n.has(p) ? n.delete(p) : n.add(p); return { ...pr, selectedDeletions: n }; }),
            toggleCommandSelection: (c: string) => setState(p => { const n = new Set(p.selectedCommands); n.has(c) ? n.delete(c) : n.add(c); return { ...p, selectedCommands: n }; })
        }
    };
};
