import { MdKeyboardArrowRight, MdKeyboardArrowDown, MdStarOutline, MdFolderOpen, MdFolder, MdStar } from 'react-icons/md';
import { Collapse, Box, Checkbox, Typography, IconButton } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

import useConfigStore from '@/sidebar/store/configStore';
import FileIcon from '@/sidebar/components/fileIcon';

import type { FileNode } from '@/sidebar/types';

interface Props { node: FileNode; level?: number; selectedPaths: Set<string>; expandedPaths: Set<string>; pinnedPaths: Set<string>; isCopyMode?: boolean; onCopyPath?: (path: string) => void; onToggleSelection: (node: FileNode, shouldSelect: boolean) => void; onToggleExpansion: (path: string) => void; onTogglePin?: (path: string) => void; searchTerm?: string; }

const FileTreeItem = ({ node, level = 0, selectedPaths, expandedPaths, pinnedPaths, isCopyMode = false, onCopyPath, onToggleSelection, onToggleExpansion, onTogglePin, searchTerm }: Props) => {
  const { compactMode } = useConfigStore();
  const theme = useTheme();

  const isExpanded = (searchTerm && searchTerm.length > 0) || expandedPaths.has(node.path);
  const isPinned = node.type === 'file' && pinnedPaths.has(node.path);
  const getAllChildrenPaths = (n: FileNode): string[] => [...(n.type === 'file' ? [n.path] : []), ...(n.children ? n.children.flatMap(getAllChildrenPaths) : [])];
  const allDescendants = getAllChildrenPaths(node);
  const selectedDescendantsCount = allDescendants.filter(p => selectedPaths.has(p)).length;
  const isFullySelected = allDescendants.length > 0 && selectedDescendantsCount === allDescendants.length;
  const isPartiallySelected = selectedDescendantsCount > 0 && selectedDescendantsCount < allDescendants.length;
  const isSelected = selectedPaths.has(node.path) || isFullySelected;
  const checkVisibility = (n: FileNode, term: string): boolean => n.name.toLowerCase().includes(term.toLowerCase()) || (n.children ? n.children.some(c => checkVisibility(c, term)) : false);
  const isVisible = () => { if (!searchTerm) return true; if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) return true; if (node.children) return node.children.some(child => checkVisibility(child, searchTerm)); return false; };

  if (!isVisible()) return null;

  const handleExpandClick = (e: React.MouseEvent) => { e.stopPropagation(); onToggleExpansion(node.path); };
  const handleItemClick = (e: React.MouseEvent) => { if ((e.target as HTMLElement).closest('.action-btn')) return; if (isCopyMode && onCopyPath) return onCopyPath(node.path); onToggleSelection(node, !isFullySelected); };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => { e.stopPropagation(); onToggleSelection(node, !isFullySelected); };

  const iconSize = compactMode ? 18 : 20;

  return (
    <Box>
      <Box onClick={handleItemClick} sx={{ display: 'flex', alignItems: 'center', py: compactMode ? 0 : 0.5, pr: 1, pl: 1 + (level * 1.5), width: '100%', cursor: 'pointer', transition: 'background-color 0.2s', bgcolor: isSelected || isPartiallySelected ? alpha(theme.palette.primary.main, 0.15) : 'transparent', minHeight: compactMode ? 24 : 32, '&:hover': { bgcolor: 'action.hover' }, '&:hover .star-btn': { opacity: isPinned ? 1 : 0.4 } }}>
        {node.type === 'directory' ? <IconButton className="action-btn" size="small" onClick={handleExpandClick} sx={{ p: 0.5, mr: 0.5 }}>{isExpanded ? <MdKeyboardArrowDown size={iconSize} /> : <MdKeyboardArrowRight size={iconSize} />}</IconButton> : <Box sx={{ width: 24, mr: 0.5 }} />}
        {!isCopyMode && <Checkbox size="small" checked={isSelected} indeterminate={isPartiallySelected} onChange={handleCheckboxChange} sx={{ p: 0.5, '& .MuiSvgIcon-root': { fontSize: iconSize } }} />}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, overflow: 'hidden', flexGrow: 1 }}>{node.type === 'directory' ? (isExpanded ? <Box component={MdFolderOpen} sx={{ mr: 1, color: 'text.secondary', fontSize: iconSize }} /> : <Box component={MdFolder} sx={{ mr: 1, color: 'text.secondary', fontSize: iconSize }} />) : <Box sx={{ mr: 1, display: 'flex' }}><FileIcon fileName={node.name} sx={{ fontSize: iconSize }} /></Box>}<Typography variant="body2" noWrap title={node.name} sx={{ fontSize: compactMode ? '0.8rem' : '0.875rem' }}>{node.name}</Typography>{node.type === 'file' && node.lines && !compactMode && <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>({node.lines}L)</Typography>}</Box>
        {!isCopyMode && node.type === 'file' && onTogglePin && <IconButton className="action-btn star-btn" size="small" onClick={(e) => { e.stopPropagation(); onTogglePin(node.path); }} sx={{ p: 0.25, ml: 1, opacity: isPinned ? 1 : 0, transition: 'opacity 0.2s' }}>{isPinned ? <Box component={MdStar} sx={{ fontSize: iconSize - 2, color: 'warning.main' }} /> : <Box component={MdStarOutline} sx={{ fontSize: iconSize - 2, color: 'text.secondary' }} />}</IconButton>}
      </Box>
      {node.children && <Collapse in={isExpanded} timeout="auto" unmountOnExit>{node.children.map((child) => <FileTreeItem key={child.path} node={child} level={level + 1} selectedPaths={selectedPaths} expandedPaths={expandedPaths} pinnedPaths={pinnedPaths} isCopyMode={isCopyMode} onCopyPath={onCopyPath} onToggleSelection={onToggleSelection} onToggleExpansion={onToggleExpansion} onTogglePin={onTogglePin} searchTerm={searchTerm} />)}</Collapse>}
    </Box>
  );
};

export default FileTreeItem;