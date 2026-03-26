import { useState, useEffect, useCallback } from 'react';

import useConfigStore from '@/sidebar/store/configStore';

export const useTools = (fetchViaBackground) => {
    const { serverUrl, checkInterval, verbosity, translateCommit, showCommandModal, setTranslateCommit } = useConfigStore();

    const [originalCommitMessage, setOriginalCommitMessage] = useState('');
    const [originalCommitType, setOriginalCommitType] = useState('feat');
    const [serverStatus, setServerStatus] = useState('checking');
    const [cmdDialogOpen, setCmdDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [commitMessage, setCommitMessage] = useState('');
    const [cmdLoading, setCmdLoading] = useState(false);
    const [commitType, setCommitType] = useState('feat');
    const [cmdOutput, setCmdOutput] = useState(null);
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
            try {
                const response = await fetchViaBackground(`${serverUrl}/health`);
                if (isMounted) setServerStatus(response.success ? 'connected' : 'disconnected');
            } catch {
                if (isMounted) setServerStatus('disconnected');
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, checkInterval);
        return () => { isMounted = false; clearInterval(interval); };
    }, [serverUrl, checkInterval, fetchViaBackground]);

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

    return {
        state: { serverStatus, cmdDialogOpen, actionLoading, commitMessage, cmdLoading, commitType, cmdOutput, message, translateCommit, originalCommitMessage, originalCommitType },
        actions: { setCmdDialogOpen, setCommitMessage, setCommitType, setMessage, setTranslateCommit, handleCommit, handleFetchCommandOutput, handleInjectOutput, showNotification }
    };
};