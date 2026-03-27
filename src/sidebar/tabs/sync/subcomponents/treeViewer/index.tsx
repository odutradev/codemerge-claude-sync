import { MdSearch, MdContentCopy, MdPushPin, MdOutlinePushPin, MdRefresh, MdClose } from 'react-icons/md'
import { CircularProgress, Tooltip, IconButton, Box } from '@mui/material'
import { useState, useEffect } from 'react'

import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import FileTreeItem from '@/sidebar/tabs/sync/subcomponents/filetreeItem'
import Styled from './styles'

import type TreeViewerProps from './types'

const TreeViewer = ({
    projectStructure,
    searchTerm,
    setSearchTerm,
    isCopyMode,
    setIsCopyMode,
    persistSelection,
    setPersistSelection,
    selectedPaths,
    expandedPaths,
    pinnedPaths,
    handleCopyPath,
    handleToggleSelection,
    handleToggleExpansion,
    handleTogglePin,
    serverStatus,
    isChecking,
    loading,
    handleFetchStructure
}: TreeViewerProps) => {
    const [isSearchActive, setIsSearchActive] = useState(false)

    useEffect(() => {
        if (searchTerm.length > 0 && !isSearchActive) {
            setIsSearchActive(true)
        }
    }, [searchTerm, isSearchActive])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)

    const handleCloseSearch = () => {
        setIsSearchActive(false)
        setSearchTerm('')
    }

    const handleToggleCopyMode = () => setIsCopyMode(!isCopyMode)
    
    const handleTogglePersist = () => setPersistSelection(!persistSelection)

    return (
        <Styled.Container variant="outlined">
            <Styled.Header>
                <Styled.LeftSection>
                    {isSearchActive && projectStructure ? (
                        <Styled.SearchWrapper>
                            <Box component={MdSearch} style={{ color: 'var(--mui-palette-text-secondary)', marginRight: 8, fontSize: 20 }} />
                            <Styled.SearchInput
                                autoFocus
                                placeholder="Filtrar..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <IconButton size="small" onClick={handleCloseSearch}>
                                <MdClose size={16} />
                            </IconButton>
                        </Styled.SearchWrapper>
                    ) : (
                        <ServerStatusIndicator
                            status={serverStatus}
                            isChecking={isChecking}
                            showText={true}
                        />
                    )}
                </Styled.LeftSection>

                <Styled.RightSection>
                    {projectStructure && !isSearchActive && (
                        <Tooltip title="Pesquisar">
                            <IconButton size="small" onClick={() => setIsSearchActive(true)}>
                                <MdSearch size={20} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {projectStructure && (
                        <>
                            <Tooltip title={isCopyMode ? "Modo de cópia ativado" : "Ativar modo de cópia"}>
                                <IconButton size="small" onClick={handleToggleCopyMode} color={isCopyMode ? "primary" : "default"}>
                                    <MdContentCopy size={20} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={persistSelection ? "Manter seleção ativa" : "Manter seleção inativa"}>
                                <IconButton size="small" onClick={handleTogglePersist} color={persistSelection ? "primary" : "default"}>
                                    {persistSelection ? <MdPushPin size={20} /> : <MdOutlinePushPin size={20} />}
                                </IconButton>
                            </Tooltip>
                        </>
                    )}

                    <Tooltip title="Atualizar Estrutura">
                        <span>
                            <IconButton
                                size="small"
                                onClick={handleFetchStructure}
                                disabled={loading || isChecking || serverStatus !== 'connected'}
                            >
                                {loading ? <CircularProgress size={16} /> : <MdRefresh size={20} />}
                            </IconButton>
                        </span>
                    </Tooltip>
                </Styled.RightSection>
            </Styled.Header>
            
            <Styled.ScrollArea>
                {projectStructure && (
                    <FileTreeItem
                        node={projectStructure}
                        selectedPaths={selectedPaths}
                        expandedPaths={expandedPaths}
                        pinnedPaths={pinnedPaths}
                        isCopyMode={isCopyMode}
                        onCopyPath={handleCopyPath}
                        onToggleSelection={handleToggleSelection}
                        onToggleExpansion={handleToggleExpansion}
                        onTogglePin={handleTogglePin}
                        searchTerm={searchTerm}
                    />
                )}
            </Styled.ScrollArea>
        </Styled.Container>
    )
}

export default TreeViewer