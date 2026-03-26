import { useState, useEffect, useCallback, useRef } from 'react';

import { useNotification } from '@/sidebar/hooks/useNotification';
import { useServerStatus } from '@/sidebar/hooks/useServerStatus';
import { processCode } from '@/sidebar/utils/codeProcessor';
import useSelectionStore from '@/sidebar/stores/selection';
import useHistoryStore from '@/sidebar/stores/history';
import useConfigStore from '@/sidebar/stores/config';

import type { FetchViaBackground, CommandOutput, Artifact, HookStatus } from '@/sidebar/types';
import type { UseArtifactsReturn } from './types';

export const useArtifacts = (fetchViaBackground: FetchViaBackground): UseArtifactsReturn => {
    const { serverUrl, checkInterval, removeComments, removeEmptyLines, removeLogs, translateCommit, showCommandModal, autoSelectSynced, setRemoveComments, setTranslateCommit } = useConfigStore();
    const { histories, addSnapshot, setHistoryIndex, cleanExpired, getHistory } = useHistoryStore();
    const { serverStatus, isChecking } = useServerStatus(serverUrl, checkInterval, fetchViaBackground);
    const { activeProjectId, addPathsToSelection } = useSelectionStore();
    const { showNotification } = useNotification();

    const [originalCommitMessage, setOriginalCommitMessage] = useState('');
    const [selectedDeletions, setSelectedDeletions] = useState<Set<string>>(new Set());
    const [selectedCommands, setSelectedCommands] = useState<Set<string>>(new Set());
    const [originalCommitType, setOriginalCommitType] = useState('feat');
    const [commandsToExecute, setCommandsToExecute] = useState<string[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    const [cmdDialogOpen, setCmdDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [commitMessage, setCommitMessage] = useState('');
    const [hookStatus, setHookStatus] = useState<HookStatus>('idle');
    const [commitType, setCommitType] = useState('feat');
    const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
    const [cmdLoading, setCmdLoading] = useState(false);
    const [activeUrl, setActiveUrl] = useState<string | null>(null);
    const [fetching, setFetching] = useState(false);
    const [cmdOutput, setCmdOutput] = useState<CommandOutput | null>(null);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);

    const autoFetchedUrls = useRef<Set<string>>(new Set());
    const historyData = activeUrl ? histories[activeUrl] : null;
    const currentHistoryIndex = historyData?.currentIndex ?? -1;
    const historyLength = historyData?.snapshots?.length ?? 0;

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            cleanExpired();
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tabs[0]?.url || !isMounted) return;
            const url = tabs[0].url.split('#')[0]; setActiveUrl(url);
            const history = getHistory(url); if (history.currentIndex < 0) return;
            const snap = history.snapshots[history.currentIndex];
            setOriginalCommitMessage(snap.commitMessage); setOriginalCommitType(snap.commitType); setCommandsToExecute(snap.commandsToExecute || []); setSelectedDeletions(new Set(snap.selectedDeletions)); setSelectedCommands(new Set(snap.selectedCommands)); setCommitMessage(snap.commitMessage); setSelectedIndices(new Set(snap.selectedIndices)); setFilesToDelete(snap.filesToDelete); setCommitType(snap.commitType); setArtifacts(snap.artifacts);
        };
        init(); return () => { isMounted = false; };
    }, [cleanExpired, getHistory]);

    const handleFetchArtifacts = useCallback(async (silent = false) => {
        setActionLoading(true); setFetching(true);
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tabs[0]) throw new Error('Aba ativa não encontrada');
            const isGemini = tabs[0].url!.includes('gemini.google.com'); const isClaude = tabs[0].url!.includes('claude.ai');
            if (!isGemini && !isClaude) throw new Error('Esta função requer Gemini ou Claude aberto na aba ativa');
            const url = tabs[0].url!.split('#')[0]; if (url !== activeUrl) setActiveUrl(url);
            const res = await chrome.tabs.sendMessage(tabs[0].id!, { type: isGemini ? 'GET_GEMINI_ARTIFACTS' : 'GET_CLAUDE_ARTIFACTS' });
            if (!res.success) throw new Error(res.error);
            const rawArtifacts = res.artifacts ?? []; let parsedCommandsToExecute: string[] = []; let parsedFilesToDelete: string[] = []; let parsedCommitType = 'feat'; let parsedCommitMsg = '';
            const filteredArtifacts = rawArtifacts.filter((art: Artifact) => { if (art.name === 'codemerge.result.json') { try { const parsed = JSON.parse(art.code); parsedCommandsToExecute = parsed.commandsToExecute ?? []; parsedFilesToDelete = parsed.filesToDelete ?? []; parsedCommitType = parsed.commitType ?? 'feat'; parsedCommitMsg = parsed.commitMessage ?? ''; } catch { return false; } return false; } return true; });
            const initialSelection = new Set<number>(); filteredArtifacts.forEach((art: Artifact, i: number) => { if (!art.name.toLowerCase().endsWith('.md')) initialSelection.add(i); });
            const newDeletions = new Set(parsedFilesToDelete); const newCommands = new Set(parsedCommandsToExecute);
            setOriginalCommitMessage(parsedCommitMsg); setCommandsToExecute(parsedCommandsToExecute); setOriginalCommitType(parsedCommitType); setSelectedDeletions(newDeletions); setSelectedCommands(newCommands); setCommitMessage(parsedCommitMsg); setSelectedIndices(initialSelection); setFilesToDelete(parsedFilesToDelete); setCommitType(parsedCommitType); setArtifacts(filteredArtifacts);
            await addSnapshot(url, { commandsToExecute: parsedCommandsToExecute, selectedDeletions: Array.from(newDeletions), selectedCommands: Array.from(newCommands), filesToDelete: parsedFilesToDelete, commitMessage: parsedCommitMsg, selectedIndices: Array.from(initialSelection), commitType: parsedCommitType, artifacts: filteredArtifacts });
            if (!silent) showNotification(`${filteredArtifacts.length} artefatos encontrados`, 'success');
        } catch (error: any) { if (!silent) showNotification(`Erro: ${error.message}`, 'error'); } finally { setActionLoading(false); setFetching(false); }
    }, [activeUrl, showNotification, addSnapshot]);

    const applySnapshot = useCallback((index: number) => {
        if (!activeUrl) return; const history = getHistory(activeUrl); const snap = history.snapshots[index]; if (!snap) return;
        setHistoryIndex(activeUrl, index); setOriginalCommitMessage(snap.commitMessage); setOriginalCommitType(snap.commitType); setCommandsToExecute(snap.commandsToExecute || []); setSelectedDeletions(new Set(snap.selectedDeletions)); setSelectedCommands(new Set(snap.selectedCommands)); setCommitMessage(snap.commitMessage); setSelectedIndices(new Set(snap.selectedIndices)); setFilesToDelete(snap.filesToDelete); setCommitType(snap.commitType); setArtifacts(snap.artifacts);
    }, [activeUrl, getHistory, setHistoryIndex]);

    const handlePrevHistory = useCallback(() => { if (currentHistoryIndex > 0) applySnapshot(currentHistoryIndex - 1); }, [currentHistoryIndex, applySnapshot]);
    const handleNextHistory = useCallback(() => { if (currentHistoryIndex < historyLength - 1) applySnapshot(currentHistoryIndex + 1); }, [currentHistoryIndex, historyLength, applySnapshot]);

    useEffect(() => { if (serverStatus === 'connected' && historyLength === 0 && activeUrl && !fetching && !autoFetchedUrls.current.has(activeUrl)) { autoFetchedUrls.current.add(activeUrl); handleFetchArtifacts(true); } }, [serverStatus, historyLength, activeUrl, fetching, handleFetchArtifacts]);

    const handleCommit = async () => {
        if (!commitMessage.trim()) return showNotification('Mensagem de commit vazia', 'warning');
        setActionLoading(true);
        try {
            const res = await fetchViaBackground(`${serverUrl}/commit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', type: commitType, message: commitMessage, translate: translateCommit }) });
            if (!res.success) throw new Error(`Commit: ${res.error}`);
            const data = res.data ? JSON.parse(res.data) : {};
            setOriginalCommitMessage(commitMessage); setOriginalCommitType(commitType); setCommitMessage(''); showNotification('Commit realizado com sucesso!', 'success');
            setCmdOutput({ type: 'commit', command: `git commit -m "${commitType}: ${commitMessage}"`, timestamp: Date.now(), success: data.success ?? true, output: data.output ?? 'Commit executado sem retorno de texto.', error: data.error ?? null });
            if (showCommandModal) setCmdDialogOpen(true);
        } catch (error: any) { showNotification(`Erro ao commitar: ${error.message}`, 'error'); setCmdOutput({ type: 'commit', command: `git commit -m "${commitType}: ${commitMessage}"`, timestamp: Date.now(), success: false, output: null, error: error.message }); if (showCommandModal) setCmdDialogOpen(true); } finally { setActionLoading(false); }
    };

    const handleExecuteCommands = async () => {
        if (selectedCommands.size === 0) return showNotification('Nenhum comando selecionado', 'warning');
        setActionLoading(true);
        try {
            const res = await fetchViaBackground(`${serverUrl}/execute-commands`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', commandsToExecute: Array.from(selectedCommands) }) });
            if (!res.success) throw new Error(`Execução: ${res.error}`);
            const data = res.data ? JSON.parse(res.data) : {}; showNotification('Comandos enviados para execução!', 'success');
            setCmdOutput({ type: 'execute', command: 'Múltiplos comandos', timestamp: Date.now(), success: data.success ?? true, output: JSON.stringify(data.results, null, 2), error: data.error ?? null });
            if (showCommandModal) setCmdDialogOpen(true);
        } catch (error: any) { showNotification(`Erro: ${error.message}`, 'error'); setCmdOutput({ type: 'execute', command: 'Falha na execução', timestamp: Date.now(), success: false, output: null, error: error.message }); if (showCommandModal) setCmdDialogOpen(true); } finally { setActionLoading(false); }
    };

    const handleApplyAll = async () => {
        setActionLoading(true); setHookStatus('loading');
        try {
            const tasks: Promise<any>[] = [];
            if (selectedIndices.size > 0) {
                const selectedFiles = Array.from(selectedIndices).map(i => ({ path: artifacts[i].name, content: removeComments ? processCode(artifacts[i].code, { removeComments: true, removeEmptyLines, removeLogs }) : artifacts[i].code }));
                tasks.push(fetchViaBackground(`${serverUrl}/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ files: selectedFiles }) }));
                if (autoSelectSynced && activeProjectId) addPathsToSelection(activeProjectId, selectedFiles.map(f => f.path));
            }
            if (selectedDeletions.size > 0) {
                tasks.push(fetchViaBackground(`${serverUrl}/delete-files`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', files: Array.from(selectedDeletions) }) }));
                setSelectedDeletions(new Set());
            }
            const results = await Promise.all(tasks);
            const errors = results.filter(r => !r.success);
            if (errors.length > 0) throw new Error(errors.map(e => e.error).join(' | '));
            showNotification('Sincronização e deleções aplicadas!', 'success'); setHookStatus('success');
        } catch (error: any) { showNotification(`Erro: ${error.message}`, 'error'); setHookStatus('error'); } finally { setActionLoading(false); setTimeout(() => setHookStatus(p => p !== 'loading' ? 'idle' : p), 4000); }
    };

    const handleFetchCommandOutput = async () => {
        setCmdLoading(true);
        try { const res = await fetchViaBackground(`${serverUrl}/command-output`); if (!res.success) throw new Error(res.error); setCmdOutput({ ...JSON.parse(res.data), type: 'hook' }); } catch (error: any) { showNotification(`Erro ao buscar output: ${error.message}`, 'error'); setCmdOutput({ type: 'hook', command: 'fetch', timestamp: Date.now(), success: false, output: null, error: error.message }); } finally { setCmdLoading(false); }
    };

    const handleOpenCmdDialog = () => { setCmdDialogOpen(true); handleFetchCommandOutput(); };

    const handleInjectOutput = async () => {
        if (!cmdOutput) return;
        const content = cmdOutput.status === 'no_command_executed' ? 'Nenhum comando foi executado recentemente.' : `COMMAND: ${cmdOutput.command}\nTIMESTAMP: ${cmdOutput.timestamp}\nSTATUS: ${cmdOutput.success ? 'SUCCESS' : 'ERROR'}\n\nOUTPUT:\n${cmdOutput.output ?? cmdOutput.error ?? ''}`;
        try { const tabs = await chrome.tabs.query({ active: true, currentWindow: true }); if (!tabs[0]) throw new Error('Aba não encontrada'); const res = await chrome.tabs.sendMessage(tabs[0].id!, { type: tabs[0].url?.includes('gemini.google.com') ? 'ADD_FILE_GEMINI' : 'ADD_FILE', fileName: 'command-output.txt', content }); if (!res?.success && res?.error) throw new Error(res.error); showNotification('Output inserido no input!', 'success'); setCmdDialogOpen(false); } catch (err: any) { showNotification(`Erro ao injetar: ${err.message}`, 'error'); }
    };

    return { state: { artifacts, filesToDelete, commandsToExecute, selectedIndices, selectedDeletions, selectedCommands, fetching, serverStatus, isChecking, cmdDialogOpen, cmdOutput, cmdLoading, removeComments, commitMessage, commitType, translateCommit, originalCommitMessage, originalCommitType, actionLoading, historyLength, currentHistoryIndex, hookStatus }, actions: { handleFetchArtifacts, handleApplyAll, handleExecuteCommands, handleCommit, handleOpenCmdDialog, handleFetchCommandOutput, handleInjectOutput, handleDeselectAll: () => { setSelectedDeletions(new Set()); setSelectedCommands(new Set()); setSelectedIndices(new Set()); }, handlePrevHistory, handleNextHistory, setCmdDialogOpen, toggleSelection: (i: number) => setSelectedIndices(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; }), toggleDeleteSelection: (p: string) => setSelectedDeletions(pr => { const n = new Set(pr); n.has(p) ? n.delete(p) : n.add(p); return n; }), toggleCommandSelection: (c: string) => setSelectedCommands(p => { const n = new Set(p); n.has(c) ? n.delete(c) : n.add(c); return n; }), setRemoveComments, setCommitMessage, setCommitType, setTranslateCommit } };
};
