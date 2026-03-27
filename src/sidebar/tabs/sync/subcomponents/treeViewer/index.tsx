import { MdSearch, MdContentCopy, MdPushPin, MdOutlinePushPin } from 'react-icons/md'
import { Tooltip, IconButton, Box } from '@mui/material'

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
    handleTogglePin
}: TreeViewerProps) => {
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleToggleCopyMode = () => {
        setIsCopyMode(!isCopyMode)
    }

    const handleTogglePersist = () => {
        setPersistSelection(!persistSelection)
    }

    return (
        <Styled.Container variant="outlined">
            <Styled.Header>
                <Box
                    component={MdSearch}
                    style={{ color: 'var(--mui-palette-text-secondary)', marginRight: 8, fontSize: 20 }}
                />
                <Styled.SearchInput
                    placeholder="Filtrar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                
                <Tooltip title={isCopyMode ? "Modo de cópia ativado" : "Ativar modo de cópia"}>
                    <IconButton
                        size="small"
                        onClick={handleToggleCopyMode}
                        color={isCopyMode ? "primary" : "default"}
                    >
                        <MdContentCopy size={20} />
                    </IconButton>
                </Tooltip>
                
                <Tooltip title={persistSelection ? "Manter seleção ativa" : "Manter seleção inativa"}>
                    <IconButton
                        size="small"
                        onClick={handleTogglePersist}
                        color={persistSelection ? "primary" : "default"}
                    >
                        {persistSelection ? <MdPushPin size={20} /> : <MdOutlinePushPin size={20} />}
                    </IconButton>
                </Tooltip>
            </Styled.Header>
            
            <Styled.ScrollArea>
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
            </Styled.ScrollArea>
        </Styled.Container>
    )
}

export default TreeViewer