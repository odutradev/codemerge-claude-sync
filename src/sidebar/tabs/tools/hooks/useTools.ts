import { useState, useEffect, useCallback } from 'react';

import useConfigStore from '@/sidebar/store/configStore';

import type { FetchViaBackground, CommandOutput, MessageState } from '@/sidebar/types';

export const useTools = (fetchViaBackground: FetchViaBackground) => {
    const { serverUrl, checkInterval, verbosity, translateCommit, showCommandModal, setTranslateCommit } = useConfigStore();
    const [originalCommitMessage, setOriginalCommitMessage] = useState('');
    const [originalCommitType, setOriginalCommitType] = useState('feat');
    const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [cmdDialogOpen, setCmdDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [commitMessage, setCommitMessage] = useState('');
    const [cmdLoading, setCmdLoading] = useState(false);
    const [commitType, setCommitType] = useState('feat');
    const [cmdOutput, setCmdOutput] = useState<CommandOutput | null>(null);
    const [message, setMessage] = useState<MessageState>({ open: false, text: '', type: 'info' });

    const showNotification = useCallback((text: string, type: MessageState['type'] = 'info') => { if (verbosity === 'silent') return; if (verbosity === 'errors' && type !== 'error') return; setMessage({ open: true, text, type }); }, [verbosity]);

    useEffect(() => {
        let isMounted = true;
        const checkHealth = async () => { if (!serverUrl) return; try { const res = await fetchViaBackground(`${serverUrl}/health`); if (isMounted) setServerStatus(res.success ? 'connected' : 'disconnected'); } catch { if (isMounted) setServerStatus('disconnected'); } };
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
            const data = res.data ? JSON.parse(res.data) : {};
            setOriginalCommitMessage(commitMessage); setOriginalCommitType(commitType); setCommitMessage('');
            showNotification('Commit realizado com sucesso!', 'success');
            setCmdOutput({ type: 'commit', command: `git commit -m "${commitType}: ${commitMessage}"`, timestamp: Date.now(), success: data.success ?? true, output: data.output ?? 'Commit executado sem retorno de texto.', error: data.error ?? null });
            if (showCommandModal) setCmdDialogOpen(true);
        } catch (err: any) {
            showNotification(`Erro ao commitar: ${err.message}`, 'error');
            setCmdOutput({ type: 'commit', command: `git commit -m "${commitType}: ${commitMessage}"`, timestamp: Date.now(), success: false, output: null, error: err.message });
            if (showCommandModal) setCmdDialogOpen(true);
        } finally { setActionLoading(false); }
    };

    const handleFetchCommandOutput = async () => {
        setCmdLoading(true);
        try {
            const res = await fetchViaBackground(`${serverUrl}/command-output`);
            if (!res.success) throw new Error(res.error);
            const data = JSON.parse(res.data);
            setCmdOutput({ ...data, type: 'hook' });
        } catch (err: any) { showNotification(`Erro ao buscar output: ${err.message}`, 'error'); setCmdOutput({ type: 'hook', command: 'fetch', timestamp: Date.now(), success: false, output: null, error: err.message }); } finally { setCmdLoading(false); }
    };

    const handleInjectOutput = async () => {
        if (!cmdOutput) return;
        const content = cmdOutput.status === 'no_command_executed' ? 'Nenhum comando foi executado recentemente.' : `COMMAND: ${cmdOutput.command}\nTIMESTAMP: ${cmdOutput.timestamp}\nSTATUS: ${cmdOutput.success ? 'SUCCESS' : 'ERROR'}\n\nOUTPUT:\n${cmdOutput.output ?? cmdOutput.error ?? ''}`;
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tabs[0]) throw new Error('Aba ativa não encontrada');
            const res = await chrome.tabs.sendMessage(tabs[0].id!, { type: tabs[0].url?.includes('gemini.google.com') ? 'ADD_FILE_GEMINI' : 'ADD_FILE', fileName: 'command-output.txt', content });
            if (!res?.success && res?.error) throw new Error(res.error);
            showNotification('Output inserido no input!', 'success');
            setCmdDialogOpen(false);
        } catch (err: any) { showNotification(`Erro ao injetar: ${err.message}`, 'error'); }
    };

    return { state: { serverStatus, cmdDialogOpen, actionLoading, commitMessage, cmdLoading, commitType, cmdOutput, message, translateCommit, originalCommitMessage, originalCommitType }, actions: { setCmdDialogOpen, setCommitMessage, setCommitType, setMessage, setTranslateCommit, handleCommit, handleFetchCommandOutput, handleInjectOutput, showNotification } };
};