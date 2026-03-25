import { useState, useEffect, useCallback } from 'react';

import { processCode } from '../../../utils/codeProcessor';
import useHistoryStore from '../../../store/historyStore';
import useConfigStore from '../../../store/configStore';

export const useArtifacts = (fetchViaBackground) => {
    const { serverUrl, checkInterval, verbosity, removeComments, removeEmptyLines, removeLogs, translateCommit, showCommandModal, setRemoveComments, setTranslateCommit } = useConfigStore();
    const { histories, addSnapshot, setHistoryIndex, cleanExpired, getHistory } = useHistoryStore();

    const [originalCommitMessage, setOriginalCommitMessage] = useState('');
    const [originalCommitType, setOriginalCommitType] = useState('feat');
    const [selectedDeletions, setSelectedDeletions] = useState(new Set());
    const [selectedIndices, setSelectedIndices] = useState(new Set());
    const [serverStatus, setServerStatus] = useState('checking');
    const [cmdDialogOpen, setCmdDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [commitMessage, setCommitMessage] = useState('');
    const [commitType, setCommitType] = useState('feat');
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [cmdLoading, setCmdLoading] = useState(false);
    const [activeUrl, setActiveUrl] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [cmdOutput, setCmdOutput] = useState(null);
    const [artifacts, setArtifacts] = useState([]);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });

    const historyData = activeUrl ? histories[activeUrl] : null;
    const currentHistoryIndex = historyData?.currentIndex ?? -1;
    const historyLength = historyData?.snapshots?.length ?? 0;

    const showNotification = useCallback((text, type = 'info') => {
        if (verbosity === 'silent') return;
        if (verbosity === 'errors' && type !== 'error') return;
        setMessage({ open: true, text, type });
    }, [verbosity]);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            cleanExpired();
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]?.url && isMounted) {
                const url = tabs[0].url.split('#')[0];
                setActiveUrl(url);
                const history = getHistory(url);
                if (history.currentIndex >= 0) {
                    const snap = history.snapshots[history.currentIndex];
                    setArtifacts(snap.artifacts);
                    setCommitMessage(snap.commitMessage);
                    setOriginalCommitMessage(snap.commitMessage);
                    setCommitType(snap.commitType);
                    setOriginalCommitType(snap.commitType);
                    setFilesToDelete(snap.filesToDelete);
                    setSelectedIndices(snap.selectedIndices);
                    setSelectedDeletions(snap.selectedDeletions);
                }
            }
        };
        init();
        return () => { isMounted = false; };
    }, [cleanExpired, getHistory]);

    useEffect(() => {
        let isMounted = true;
        const checkHealth = async () => {
            if (!serverUrl) return;
            if (isMounted) setIsChecking(true);
            try {
                const response = await fetchViaBackground(`${serverUrl}/health`);
                if (isMounted) setServerStatus(response.success ? 'connected' : 'disconnected');
            } catch (error) {
                if (isMounted) setServerStatus('disconnected');
            } finally {
                setTimeout(() => { if (isMounted) setIsChecking(false); }, 500);
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, checkInterval);
        return () => { isMounted = false; clearInterval(interval); };
    }, [serverUrl, checkInterval, fetchViaBackground]);

    const handleFetchArtifacts = useCallback(async (silent = false) => {
        setActionLoading(true);
        setFetching(true);
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            if (!activeTab) throw new Error('Aba ativa não encontrada');
            const isGemini = activeTab.url.includes('gemini.google.com');
            const isClaude = activeTab.url.includes('claude.ai');
            if (!isGemini && !isClaude) throw new Error('Esta função requer Gemini ou Claude aberto na aba ativa');

            const url = activeTab.url.split('#')[0];
            if (url !== activeUrl) setActiveUrl(url);

            const type = isGemini ? 'GET_GEMINI_ARTIFACTS' : 'GET_CLAUDE_ARTIFACTS';
            const response = await chrome.tabs.sendMessage(activeTab.id, { type });
            if (!response.success) throw new Error(response.error);

            const rawArtifacts = response.artifacts ?? [];
            let parsedCommitMsg = '';
            let parsedCommitType = 'feat';
            let parsedFilesToDelete = [];

            const filteredArtifacts = rawArtifacts.filter(art => {
                if (art.name === 'codemerge.result.json') {
                    try {
                        const parsed = JSON.parse(art.code);
                        parsedCommitMsg = parsed.commitMessage ?? '';
                        parsedCommitType = parsed.commitType ?? 'feat';
                        parsedFilesToDelete = parsed.filesToDelete ?? [];
                    } catch (e) {
                        return false;
                    }
                    return false;
                }
                return true;
            });

            const initialSelection = new Set();
            filteredArtifacts.forEach((artifact, index) => {
                if (!artifact.name.toLowerCase().endsWith('.md')) initialSelection.add(index);
            });
            const newDeletions = new Set(parsedFilesToDelete);

            setArtifacts(filteredArtifacts);
            setCommitMessage(parsedCommitMsg);
            setOriginalCommitMessage(parsedCommitMsg);
            setCommitType(parsedCommitType);
            setOriginalCommitType(parsedCommitType);
            setFilesToDelete(parsedFilesToDelete);
            setSelectedIndices(initialSelection);
            setSelectedDeletions(newDeletions);

            const snapshot = {
                artifacts: filteredArtifacts,
                commitMessage: parsedCommitMsg,
                commitType: parsedCommitType,
                filesToDelete: parsedFilesToDelete,
                selectedIndices: initialSelection,
                selectedDeletions: newDeletions
            };

            addSnapshot(url, snapshot);

            if (!silent) showNotification(`${filteredArtifacts.length} artefatos encontrados`, 'success');
        } catch (error) {
            if (!silent) showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setActionLoading(false);
            setFetching(false);
        }
    }, [activeUrl, showNotification, addSnapshot]);

    const applySnapshot = useCallback((index) => {
        if (!activeUrl) return;
        const history = getHistory(activeUrl);
        const snap = history.snapshots[index];
        if (!snap) return;
        setHistoryIndex(activeUrl, index);
        setArtifacts(snap.artifacts);
        setCommitMessage(snap.commitMessage);
        setOriginalCommitMessage(snap.commitMessage);
        setCommitType(snap.commitType);
        setOriginalCommitType(snap.commitType);
        setFilesToDelete(snap.filesToDelete);
        setSelectedIndices(snap.selectedIndices);
        setSelectedDeletions(snap.selectedDeletions);
    }, [activeUrl, getHistory, setHistoryIndex]);

    const handlePrevHistory = useCallback(() => {
        if (currentHistoryIndex > 0) applySnapshot(currentHistoryIndex - 1);
    }, [currentHistoryIndex, applySnapshot]);

    const handleNextHistory = useCallback(() => {
        if (currentHistoryIndex < historyLength - 1) applySnapshot(currentHistoryIndex + 1);
    }, [currentHistoryIndex, historyLength, applySnapshot]);

    useEffect(() => {
        if (serverStatus === 'connected' && historyLength === 0 && activeUrl && !fetching) {
            handleFetchArtifacts(true);
        }
    }, [serverStatus, historyLength, activeUrl, fetching, handleFetchArtifacts]);

    const handleCommit = async () => {
        if (!commitMessage.trim()) return showNotification('Mensagem de commit vazia', 'warning');
        setActionLoading(true);
        try {
            const res = await fetchViaBackground(`${serverUrl}/commit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', type: commitType, message: commitMessage, translate: translateCommit }) });
            if (!res.success) throw new Error(`Commit: ${res.error}`);

            const responseData = res.data ? JSON.parse(res.data) : {};

            setOriginalCommitMessage(commitMessage);
            setOriginalCommitType(commitType);
            setCommitMessage('');
            showNotification('Commit realizado com sucesso!', 'success');

            setCmdOutput({
                type: 'commit',
                command: `git commit -m "${commitType}: ${commitMessage}"`,
                timestamp: Date.now(),
                success: responseData.success ?? true,
                output: responseData.output ?? 'Commit executado sem retorno de texto.',
                error: responseData.error ?? null
            });
            if (showCommandModal) setCmdDialogOpen(true);
        } catch (error) {
            showNotification(`Erro ao commitar: ${error.message}`, 'error');
            setCmdOutput({
                type: 'commit',
                command: `git commit -m "${commitType}: ${commitMessage}"`,
                timestamp: Date.now(),
                success: false,
                output: null,
                error: error.message
            });
            if (showCommandModal) setCmdDialogOpen(true);
        } finally {
            setActionLoading(false);
        }
    };

    const handleApplyAll = async () => {
        setActionLoading(true);
        try {
            if (selectedIndices.size > 0) {
                const selectedFiles = Array.from(selectedIndices).map(index => {
                    const artifact = artifacts[index];
                    const content = removeComments ? processCode(artifact.code, { removeComments: true, removeEmptyLines, removeLogs }) : artifact.code;
                    return { path: artifact.name, content };
                });
                const res = await fetchViaBackground(`${serverUrl}/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ files: selectedFiles }) });
                if (!res.success) throw new Error(`Sync: ${res.error}`);
            }
            if (selectedDeletions.size > 0) {
                const res = await fetchViaBackground(`${serverUrl}/delete-files`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', files: Array.from(selectedDeletions) }) });
                if (!res.success) throw new Error(`Deleção: ${res.error}`);
                setFilesToDelete(prev => prev.filter(p => !selectedDeletions.has(p)));
                setSelectedDeletions(new Set());
            }
            showNotification('Sincronização e deleções aplicadas!', 'success');
        } catch (error) {
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleFetchCommandOutput = async () => {
        setCmdLoading(true);
        try {
            const response = await fetchViaBackground(`${serverUrl}/command-output`);
            if (!response.success) throw new Error(response.error);
            const data = JSON.parse(response.data);
            setCmdOutput({ ...data, type: 'hook' });
        } catch (error) {
            showNotification(`Erro ao buscar output: ${error.message}`, 'error');
            setCmdOutput({ error: error.message, type: 'hook' });
        } finally {
            setCmdLoading(false);
        }
    };

    const handleOpenCmdDialog = () => {
        setCmdDialogOpen(true);
        handleFetchCommandOutput();
    };

    const handleInjectOutput = async () => {
        if (!cmdOutput) return;
        const content = cmdOutput.status === 'no_command_executed' ? 'Nenhum comando foi executado recentemente.' : `COMMAND: ${cmdOutput.command}\nTIMESTAMP: ${cmdOutput.timestamp}\nSTATUS: ${cmdOutput.success ? 'SUCCESS' : 'ERROR'}\n\nOUTPUT:\n${cmdOutput.output ?? cmdOutput.error ?? ''}`;
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            if (!activeTab) throw new Error('Aba ativa não encontrada');
            const isGemini = activeTab.url.includes('gemini.google.com');
            const response = await chrome.tabs.sendMessage(activeTab.id, { type: isGemini ? 'ADD_FILE_GEMINI' : 'ADD_FILE', fileName: 'command-output.txt', content });
            if (!response?.success && response?.error) throw new Error(response.error);
            showNotification('Output inserido no input!', 'success');
            setCmdDialogOpen(false);
        } catch (error) {
            showNotification(`Erro ao injetar: ${error.message}`, 'error');
        }
    };

    const toggleSelection = (index) => {
        const next = new Set(selectedIndices);
        next.has(index) ? next.delete(index) : next.add(index);
        setSelectedIndices(next);
    };

    const toggleDeleteSelection = (path) => {
        const next = new Set(selectedDeletions);
        next.has(path) ? next.delete(path) : next.add(path);
        setSelectedDeletions(next);
    };

    const handleDeselectAll = () => {
        setSelectedIndices(new Set());
        setSelectedDeletions(new Set());
    };

    return {
        state: { artifacts, filesToDelete, selectedIndices, selectedDeletions, fetching, serverStatus, isChecking, cmdDialogOpen, cmdOutput, cmdLoading, message, removeComments, commitMessage, commitType, translateCommit, originalCommitMessage, originalCommitType, actionLoading, historyLength, currentHistoryIndex },
        actions: { handleFetchArtifacts, handleApplyAll, handleCommit, handleOpenCmdDialog, handleFetchCommandOutput, handleInjectOutput, handleDeselectAll, handlePrevHistory, handleNextHistory, setCmdDialogOpen, toggleSelection, toggleDeleteSelection, setRemoveComments, setMessage, setCommitMessage, setCommitType, setTranslateCommit }
    };
};