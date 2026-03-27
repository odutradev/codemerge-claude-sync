import { MdSearch, MdContentCopy, MdPushPin, MdOutlinePushPin, MdRefresh, MdClose } from 'react-icons/md'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'

import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import FileTreeItem from '@/sidebar/tabs/sync/subcomponents/filetreeItem'
import ActionButton from '@/sidebar/components/actionButton'
import Styled from './styles'

import type TreeViewerProps from './types'

const TreeViewer = ({ projectStructure, searchTerm, setSearchTerm, isCopyMode, setIsCopyMode, persistSelection, setPersistSelection, selectedPaths, expandedPaths, pinnedPaths, handleCopyPath, handleToggleSelection, handleToggleExpansion, handleTogglePin, serverStatus, isChecking, loading, handleFetchStructure }: TreeViewerProps) => {
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
                            <ActionButton
                                variant="icon"
                                icon={<MdClose size={16} />}
                                onClick={handleCloseSearch}
                                size="small"
                            />
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
                        <ActionButton
                            variant="icon"
                            tooltip="Pesquisar"
                            icon={<MdSearch size={20} />}
                            onClick={() => setIsSearchActive(true)}
                            size="small"
                        />
                    )}

                    {projectStructure && (
                        <>
                            <ActionButton
                                variant="icon"
                                tooltip={isCopyMode ? "Modo de cópia ativado" : "Ativar modo de cópia"}
                                icon={<MdContentCopy size={20} />}
                                onClick={handleToggleCopyMode}
                                color={isCopyMode ? 'primary' : 'inherit'}
                                size="small"
                            />

                            <ActionButton
                                variant="icon"
                                tooltip={persistSelection ? "Manter seleção ativa" : "Manter seleção inativa"}
                                icon={persistSelection ? <MdPushPin size={20} /> : <MdOutlinePushPin size={20} />}
                                onClick={handleTogglePersist}
                                color={persistSelection ? 'primary' : 'inherit'}
                                size="small"
                            />
                        </>
                    )}

                    <ActionButton
                        variant="icon"
                        tooltip="Atualizar Estrutura"
                        icon={<MdRefresh size={20} />}
                        onClick={handleFetchStructure}
                        disabled={loading || isChecking || serverStatus !== 'connected'}
                        loading={loading}
                        size="small"
                    />
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