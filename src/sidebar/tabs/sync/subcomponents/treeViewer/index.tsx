import { Box, Paper, Tooltip, IconButton } from '@mui/material';
import { MdSearch, MdContentCopy, MdPushPin, MdOutlinePushPin } from 'react-icons/md';
import { alpha } from '@mui/material/styles';

import FileTreeItem from '@/sidebar/tabs/sync/subcomponents/filetreeItem';

import type { FileNode } from '@/sidebar/types';

interface Props { projectStructure: FileNode; searchTerm: string; setSearchTerm: (s: string) => void; isCopyMode: boolean; setIsCopyMode: (m: boolean) => void; persistSelection: boolean; setPersistSelection: (p: boolean) => void; selectedPaths: Set<string>; expandedPaths: Set<string>; pinnedPaths: Set<string>; handleCopyPath: (p: string) => void; handleToggleSelection: (n: FileNode, s: boolean) => void; handleToggleExpansion: (p: string) => void; handleTogglePin: (p: string) => void; }

export const TreeViewer = ({ projectStructure, searchTerm, setSearchTerm, isCopyMode, setIsCopyMode, persistSelection, setPersistSelection, selectedPaths, expandedPaths, pinnedPaths, handleCopyPath, handleToggleSelection, handleToggleExpansion, handleTogglePin }: Props) => (
    <Paper variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', mb: 2 }}>
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider', bgcolor: 'action.hover' }}>
            <Box component={MdSearch} sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <input style={{ border: 'none', outline: 'none', flexGrow: 1, background: 'transparent', color: 'inherit', fontSize: '0.875rem' }} placeholder="Filtrar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Tooltip title={isCopyMode ? "Modo de cópia ativado" : "Ativar modo de cópia"}><IconButton size="small" onClick={() => setIsCopyMode(!isCopyMode)} color={isCopyMode ? "primary" : "default"}><MdContentCopy size={20} /></IconButton></Tooltip>
            <Tooltip title={persistSelection ? "Manter seleção ativa" : "Manter seleção inativa"}><IconButton size="small" onClick={() => setPersistSelection(!persistSelection)} color={persistSelection ? "primary" : "default"}>{persistSelection ? <MdPushPin size={20} /> : <MdOutlinePushPin size={20} />}</IconButton></Tooltip>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'auto', '&::-webkit-scrollbar': { width: '6px', height: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.1), borderRadius: '3px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.2) } }}>
            <FileTreeItem node={projectStructure} selectedPaths={selectedPaths} expandedPaths={expandedPaths} pinnedPaths={pinnedPaths} isCopyMode={isCopyMode} onCopyPath={handleCopyPath} onToggleSelection={handleToggleSelection} onToggleExpansion={handleToggleExpansion} onTogglePin={handleTogglePin} searchTerm={searchTerm} />
        </Box>
    </Paper>
);