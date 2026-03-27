import { useState, useEffect, useCallback, useMemo } from 'react'

import { useServerStatus } from '@/sidebar/hooks/useServerStatus'
import { flattenStructure } from '@/sidebar/utils/treeProcessor'
import useNotificationStore from '@/sidebar/stores/notification'
import { processCode } from '@/sidebar/utils/codeProcessor'
import useSelectionStore from '@/sidebar/stores/selection'
import useConfigStore from '@/sidebar/stores/config'

import type { FileNode, FetchViaBackground } from '@/sidebar/types'
import type UseSyncReturn from './types'

const useSync = (fetchViaBackground: FetchViaBackground): UseSyncReturn => {
    const { serverUrl, checkInterval, persistSelection, setPersistSelection, removeComments, removeEmptyLines, removeLogs } = useConfigStore()
    const { selections, expansions, pinned, activeProjectId, setActiveProjectId, setProjectSelection, hasStoredSelection, toggleExpansion, togglePin } = useSelectionStore()
    const { serverStatus, isChecking } = useServerStatus(serverUrl, checkInterval, fetchViaBackground)
    const { showNotification } = useNotificationStore()

    const [projectStructure, setProjectStructure] = useState<FileNode | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [lastTreeFetchTime, setLastTreeFetchTime] = useState<number | null>(null)
    const [isCopyMode, setIsCopyMode] = useState(false)

    const allFilesMap = useMemo(() => {
        const flatNodes = projectStructure ? flattenStructure(projectStructure) : []
        const entries = flatNodes.map(f => [f.path, f.lines || 0] as [string, number])
        return new Map(entries)
    }, [projectStructure])

    const selectedPaths = useMemo(() => {
        const currentSelections = activeProjectId ? (selections[activeProjectId] || []) : []
        const validSelections = currentSelections.filter(p => allFilesMap.has(p))
        return new Set(validSelections)
    }, [selections, activeProjectId, allFilesMap])

    const expandedPaths = useMemo(() => {
        const currentExpansions = activeProjectId ? (expansions[activeProjectId] || []) : []
        return new Set(currentExpansions)
    }, [expansions, activeProjectId])

    const pinnedPaths = useMemo(() => {
        const currentPinned = activeProjectId ? (pinned[activeProjectId] || []) : []
        const validPinned = currentPinned.filter(p => allFilesMap.has(p))
        return new Set(validPinned)
    }, [pinned, activeProjectId, allFilesMap])

    const stats = useMemo(() => {
        if (!projectStructure || !activeProjectId) {
            return { files: 0, lines: 0, lastUpdate: '-' }
        }

        const selectedList = Array.from(selectedPaths)
        const totalLines = selectedList.reduce((sum, path) => sum + (allFilesMap.get(path) || 0), 0)
        
        const lastUpdate = lastTreeFetchTime 
            ? new Date(lastTreeFetchTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : '-'

        return {
            files: selectedList.length,
            lines: totalLines,
            lastUpdate
        }
    }, [projectStructure, selectedPaths, activeProjectId, lastTreeFetchTime, allFilesMap])

    const handleCopyPath = useCallback((path: string) => {
        const formattedPath = `{${path}}`
        navigator.clipboard.writeText(formattedPath)
        showNotification(`Caminho copiado: ${formattedPath}`, 'success')
    }, [showNotification])

    const handleToggleSelection = useCallback((node: FileNode, shouldSelect: boolean) => {
        const collect = (n: FileNode): string[] => {
            const current = n.type === 'file' ? [n.path] : []
            const children = n.children ? n.children.flatMap(collect) : []
            return [...current, ...children]
        }

        const targetPaths = collect(node)
        const nextSelection = new Set(selectedPaths)

        targetPaths.forEach(targetPath => {
            if (shouldSelect) {
                nextSelection.add(targetPath)
                return
            }

            if (node.type === 'file' && node.path === targetPath) {
                nextSelection.delete(targetPath)
                if (pinnedPaths.has(targetPath) && activeProjectId) {
                    togglePin(activeProjectId, targetPath)
                }
            } else if (!pinnedPaths.has(targetPath)) {
                nextSelection.delete(targetPath)
            }
        })

        if (activeProjectId) {
            setProjectSelection(activeProjectId, Array.from(nextSelection))
        }
    }, [selectedPaths, activeProjectId, setProjectSelection, pinnedPaths, togglePin])

    const handleTogglePin = useCallback((path: string) => {
        if (!activeProjectId) return

        const isPinning = !pinnedPaths.has(path)
        togglePin(activeProjectId, path)

        if (isPinning && !selectedPaths.has(path)) {
            const nextSelection = new Set(selectedPaths)
            nextSelection.add(path)
            setProjectSelection(activeProjectId, Array.from(nextSelection))
        }
    }, [activeProjectId, togglePin, pinnedPaths, selectedPaths, setProjectSelection])

    const handleFetchStructure = useCallback(async () => {
        setLoading(true)

        try {
            const res = await fetchViaBackground(`${serverUrl}/structure`)

            if (!res.success) {
                throw new Error(res.error)
            }

            const data = JSON.parse(res.data)
            
            setProjectStructure(data.root)
            setLastTreeFetchTime(Date.now())

            const newId = data.project || 'default-project'
            setActiveProjectId(newId)

            if (!persistSelection || !hasStoredSelection(newId)) {
                const allPaths = flattenStructure(data.root)
                const defaultSelection = allPaths.filter(f => !f.name.toLowerCase().endsWith('.md')).map(f => f.path)
                setProjectSelection(newId, defaultSelection)
            }
        } catch (err) {
            const error = err as Error
            showNotification(`Erro: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }, [serverUrl, fetchViaBackground, showNotification, persistSelection, hasStoredSelection, setProjectSelection, setActiveProjectId])

    useEffect(() => {
        if (serverStatus === 'connected' && !projectStructure && !loading) {
            handleFetchStructure()
        }
    }, [serverStatus, projectStructure, handleFetchStructure, loading])

    const handleSync = async () => {
        if (selectedPaths.size === 0) return

        setLoading(true)

        try {
            const body = JSON.stringify({
                selectedPaths: Array.from(selectedPaths)
            })

            const res = await fetchViaBackground(`${serverUrl}/selective-content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
            })

            if (!res.success) {
                throw new Error(res.error)
            }

            let content = res.data

            if (removeComments) {
                const divider = '----------------------------------------\nENDOFFILE:'
                const parts = content.split(divider)

                content = parts.map((part: string, index: number) => {
                    if (index === 0) return part

                    const lines = part.split('\n')
                    const header = lines[0]
                    const bodyAndFooter = lines.slice(1).join('\n')
                    const innerParts = bodyAndFooter.split(divider)
                    
                    const processedCode = processCode(innerParts[0], {
                        removeComments: true,
                        removeEmptyLines,
                        removeLogs
                    })

                    return `${header}\n${processedCode}\n${divider}${innerParts.slice(1).join(divider)}`
                }).join(divider)
            }

            const tabs = await chrome.tabs.query({
                active: true,
                currentWindow: true
            })

            if (!tabs[0]) {
                throw new Error('Aba não encontrada')
            }

            const targetUrl = tabs[0].url ?? ''
            const isGemini = targetUrl.includes('gemini.google.com')
            
            await chrome.tabs.sendMessage(tabs[0].id!, {
                type: isGemini ? 'ADD_FILE_GEMINI' : 'ADD_FILE',
                fileName: 'codemerge-selected.txt',
                content
            })

            showNotification('Sincronizado!', 'success')
        } catch (err) {
            const error = err as Error
            showNotification(`Erro: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    return {
        state: {
            projectStructure,
            searchTerm,
            loading,
            serverStatus,
            isChecking,
            isCopyMode,
            selectedPaths,
            expandedPaths,
            pinnedPaths,
            stats,
            serverUrl,
            persistSelection
        },
        actions: {
            setSearchTerm,
            setIsCopyMode,
            handleCopyPath,
            handleToggleSelection,
            handleToggleExpansion: (path: string) => activeProjectId && toggleExpansion(activeProjectId, path),
            handleTogglePin,
            handleFetchStructure,
            handleSync,
            setPersistSelection
        }
    }
}

export default useSync