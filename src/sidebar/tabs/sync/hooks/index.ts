import { useState, useEffect, useCallback, useMemo } from 'react';

import { useNotification } from '@/sidebar/hooks/useNotification';
import { useServerStatus } from '@/sidebar/hooks/useServerStatus';
import { flattenStructure } from '@/sidebar/utils/treeProcessor';
import { processCode } from '@/sidebar/utils/codeProcessor';
import useSelectionStore from '@/sidebar/stores/selection';
import useConfigStore from '@/sidebar/stores/config';

import type { FileNode, FetchViaBackground } from '@/sidebar/types';
import type { UseSyncReturn } from './types';

export const useSync = (fetchViaBackground: FetchViaBackground): UseSyncReturn => {
    const { serverUrl, setServerUrl, checkInterval, persistSelection, setPersistSelection, removeComments, removeEmptyLines, removeLogs } = useConfigStore();
    const { selections, expansions, pinned, activeProjectId, setActiveProjectId, setProjectSelection, hasStoredSelection, toggleExpansion, togglePin } = useSelectionStore();
    const { serverStatus, isChecking } = useServerStatus(serverUrl, checkInterval, fetchViaBackground);
    const { showNotification } = useNotification();

    const [projectStructure, setProjectStructure] = useState<FileNode | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastTreeFetchTime, setLastTreeFetchTime] = useState<number | null>(null);
    const [isCopyMode, setIsCopyMode] = useState(false);

    const allFilesMap = useMemo(() => new Map((projectStructure ? flattenStructure(projectStructure) : []).map(f => [f.path, f.lines || 0])), [projectStructure]);
    const selectedPaths = useMemo(() => new Set((activeProjectId ? (selections[activeProjectId] || []) : []).filter(p => allFilesMap.has(p))), [selections, activeProjectId, allFilesMap]);
    const expandedPaths = useMemo(() => activeProjectId ? new Set(expansions[activeProjectId] || []) : new Set<string>(), [expansions, activeProjectId]);
    const pinnedPaths = useMemo(() => new Set((activeProjectId ? (pinned[activeProjectId] || []) : []).filter(p => allFilesMap.has(p))), [pinned, activeProjectId, allFilesMap]);
    const stats = useMemo(() => {
        if (!projectStructure || !activeProjectId) return { files: 0, lines: 0, lastUpdate: '-' };
        const selectedList = Array.from(selectedPaths);
        const totalLines = selectedList.reduce((sum, path) => sum + (allFilesMap.get(path) || 0), 0);
        return { files: selectedList.length, lines: totalLines, lastUpdate: lastTreeFetchTime ? new Date(lastTreeFetchTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-' };
    }, [projectStructure, selectedPaths, activeProjectId, lastTreeFetchTime, allFilesMap]);

    const handleCopyPath = useCallback((path: string) => { const fmt = `{${path}}`; navigator.clipboard.writeText(fmt); showNotification(`Caminho copiado: ${fmt}`, 'success'); }, [showNotification]);

    const handleToggleSelection = useCallback((node: FileNode, shouldSelect: boolean) => {
        const collect = (n: FileNode): string[] => [...(n.type === 'file' ? [n.path] : []), ...(n.children ? n.children.flatMap(collect) : [])];
        const target = collect(node);
        const next = new Set(selectedPaths);
        target.forEach(p => { if (shouldSelect) next.add(p); else { if (node.type === 'file' && node.path === p) { next.delete(p); if (pinnedPaths.has(p)) togglePin(activeProjectId!, p); } else if (!pinnedPaths.has(p)) next.delete(p); } });
        if (activeProjectId) setProjectSelection(activeProjectId, Array.from(next));
    }, [selectedPaths, activeProjectId, setProjectSelection, pinnedPaths, togglePin]);

    const handleTogglePin = useCallback((path: string) => {
        if (!activeProjectId) return;
        const isPinning = !pinnedPaths.has(path);
        togglePin(activeProjectId, path);
        if (isPinning && !selectedPaths.has(path)) { const next = new Set(selectedPaths); next.add(path); setProjectSelection(activeProjectId, Array.from(next)); }
    }, [activeProjectId, togglePin, pinnedPaths, selectedPaths, setProjectSelection]);

    const handleFetchStructure = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchViaBackground(`${serverUrl}/structure`);
            if (!res.success) throw new Error(res.error);
            const data = JSON.parse(res.data);
            setProjectStructure(data.root); setLastTreeFetchTime(Date.now());
            const newId = data.project || 'default-project';
            setActiveProjectId(newId);
            if (!persistSelection || !hasStoredSelection(newId)) setProjectSelection(newId, flattenStructure(data.root).filter(f => !f.name.toLowerCase().endsWith('.md')).map(f => f.path));
        } catch (err: any) { showNotification(`Erro: ${err.message}`, 'error'); } finally { setLoading(false); }
    }, [serverUrl, fetchViaBackground, showNotification, persistSelection, hasStoredSelection, setProjectSelection, setActiveProjectId]);

    useEffect(() => { if (serverStatus === 'connected' && !projectStructure && !loading) handleFetchStructure(); }, [serverStatus, projectStructure, handleFetchStructure, loading]);

    const handleSync = async () => {
        if (selectedPaths.size === 0) return;
        setLoading(true);
        try {
            const res = await fetchViaBackground(`${serverUrl}/selective-content`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ selectedPaths: Array.from(selectedPaths) }) });
            if (!res.success) throw new Error(res.error);
            let content = res.data;
            if (removeComments) {
                content = content.split('----------------------------------------\nENDOFFILE:').map((part: string, i: number) => {
                    if (i === 0) return part;
                    const lines = part.split('\n'); const header = lines[0]; const bodyAndFooter = lines.slice(1).join('\n');
                    const marker = '----------------------------------------\nENDOFFILE:'; const parts = bodyAndFooter.split(marker);
                    return `${header}\n${processCode(parts[0], { removeComments: true, removeEmptyLines, removeLogs })}\n${marker}${parts.slice(1).join(marker)}`;
                }).join('----------------------------------------\nENDOFFILE:');
            }
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tabs[0]) throw new Error('Aba não encontrada');
            await chrome.tabs.sendMessage(tabs[0].id!, { type: tabs[0].url?.includes('gemini.google.com') ? 'ADD_FILE_GEMINI' : 'ADD_FILE', fileName: 'codemerge-selected.txt', content });
            showNotification('Sincronizado!', 'success');
        } catch (err: any) { showNotification(`Erro: ${err.message}`, 'error'); } finally { setLoading(false); }
    };

    return { state: { projectStructure, searchTerm, loading, serverStatus, isChecking, isCopyMode, selectedPaths, expandedPaths, pinnedPaths, stats, serverUrl, persistSelection }, actions: { setSearchTerm, setIsCopyMode, handleCopyPath, handleToggleSelection, handleToggleExpansion: (p: string) => activeProjectId && toggleExpansion(activeProjectId, p), handleTogglePin, handleFetchStructure, handleSync, setServerUrl, setPersistSelection } };
};
