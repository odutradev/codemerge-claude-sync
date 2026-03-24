import { useState, useEffect, useCallback } from 'react';

import { processCode } from '../../../utils/codeProcessor';
import useConfigStore from '../../../store/configStore';

export const useArtifacts = (fetchViaBackground) => {
    const { serverUrl, checkInterval, verbosity, removeComments, removeEmptyLines, removeLogs, setRemoveComments } = useConfigStore();
    const [originalCommitMessage, setOriginalCommitMessage] = useState('');
    const [selectedIndices, setSelectedIndices] = useState(new Set());
    const [serverStatus, setServerStatus] = useState('checking');
    const [cmdDialogOpen, setCmdDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [commitMessage, setCommitMessage] = useState('');
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [cmdLoading, setCmdLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [cmdOutput, setCmdOutput] = useState(null);
    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });

    const showNotification = useCallback((text, type = 'info') => {
        if (verbosity === 'silent') return;
        if (verbosity === 'errors' && type !== 'error') return;
        setMessage({ open: true, text, type });
    }, [verbosity]);

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
        setLoading(true);
        setFetching(true);
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            if (!activeTab) throw new Error('Aba ativa não encontrada');
            const isGemini = activeTab.url.includes('gemini.google.com');
            const isClaude = activeTab.url.includes('claude.ai');
            if (!isGemini && !isClaude) throw new Error('Esta função requer Gemini ou Claude aberto na aba ativa');
            const type = isGemini ? 'GET_GEMINI_ARTIFACTS' : 'GET_CLAUDE_ARTIFACTS';
            const response = await chrome.tabs.sendMessage(activeTab.id, { type });
            if (!response.success) throw new Error(response.error);
            const rawArtifacts = response.artifacts ?? [];
            let parsedCommitMsg = '';
            let parsedFilesToDelete = [];
            const filteredArtifacts = rawArtifacts.filter(art => {
                if (art.name === 'codemerge.result.json') {
                    try {
                        const parsed = JSON.parse(art.code);
                        parsedCommitMsg = parsed.commitMessage ?? '';
                        parsedFilesToDelete = parsed.filesToDelete ?? [];
                    } catch (e) {
                        return false;
                    }
                    return false;
                }
                return true;
            });
            setArtifacts(filteredArtifacts);
            setCommitMessage(parsedCommitMsg);
            setOriginalCommitMessage(parsedCommitMsg);
            setFilesToDelete(parsedFilesToDelete);
            const initialSelection = new Set();
            filteredArtifacts.forEach((artifact, index) => {
                if (!artifact.name.toLowerCase().endsWith('.md')) initialSelection.add(index);
            });
            setSelectedIndices(initialSelection);
            if (!silent) showNotification(`${filteredArtifacts.length} artefatos encontrados`, 'success');
        } catch (error) {
            if (!silent) showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, [showNotification]);

    useEffect(() => {
        if (serverStatus === 'connected') handleFetchArtifacts(true);
    }, [serverStatus, handleFetchArtifacts]);

    const handleSync = async () => {
        if (selectedIndices.size === 0) return;
        setLoading(true);
        try {
            const selectedFiles = Array.from(selectedIndices).map(index => {
                const artifact = artifacts[index];
                const content = removeComments ? processCode(artifact.code, { removeComments: true, removeEmptyLines, removeLogs }) : artifact.code;
                return { path: artifact.name, content };
            });
            const response = await fetchViaBackground(`${serverUrl}/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ files: selectedFiles }) });
            if (!response.success) throw new Error(response.error);
            showNotification('Artefatos enviados!', 'success');
        } catch (error) {
            showNotification(`Erro: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCommit = async () => {
        if (!commitMessage.trim()) return showNotification('Mensagem de commit vazia', 'warning');
        setActionLoading(true);
        try {
            const response = await fetchViaBackground(`${serverUrl}/commit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', message: commitMessage }) });
            if (!response.success) throw new Error(response.error);
            showNotification('Commit realizado com sucesso!', 'success');
            setCommitMessage('');
            setOriginalCommitMessage('');
        } catch (error) {
            showNotification(`Erro ao commitar: ${error.message}`, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteFiles = async (pathsToDelete) => {
        if (!pathsToDelete || pathsToDelete.length === 0) return;
        setActionLoading(true);
        try {
            const response = await fetchViaBackground(`${serverUrl}/delete-files`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basePath: './', files: pathsToDelete }) });
            if (!response.success) throw new Error(response.error);
            showNotification(`${pathsToDelete.length} arquivos apagados!`, 'success');
            setFilesToDelete(prev => prev.filter(p => !pathsToDelete.includes(p)));
        } catch (error) {
            showNotification(`Erro ao apagar: ${error.message}`, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleFetchCommandOutput = async () => {
        setCmdLoading(true);
        try {
            const response = await fetchViaBackground(`${serverUrl}/command-output`);
            if (!response.success) throw new Error(response.error);
            setCmdOutput(JSON.parse(response.data));
        } catch (error) {
            showNotification(`Erro ao buscar output: ${error.message}`, 'error');
            setCmdOutput({ error: error.message });
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

    const handleDeselectAll = () => setSelectedIndices(new Set());

    return {
        state: { artifacts, selectedIndices, loading, fetching, serverStatus, isChecking, cmdDialogOpen, cmdOutput, cmdLoading, message, removeComments, commitMessage, originalCommitMessage, filesToDelete, actionLoading },
        actions: { handleFetchArtifacts, handleSync, handleOpenCmdDialog, handleFetchCommandOutput, handleInjectOutput, handleDeselectAll, setCmdDialogOpen, toggleSelection, setRemoveComments, setMessage, handleCommit, handleDeleteFiles, setCommitMessage }
    };
};