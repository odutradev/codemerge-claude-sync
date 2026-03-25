import { KeyboardArrowRight, KeyboardArrowDown, StarOutline, FolderOpen, Folder, Star } from '@mui/icons-material';
import { Collapse, Box, Checkbox, Typography, IconButton } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

import FileIcon from '../../../../components/fileIcon/index.jsx';
import useConfigStore from '../../../../store/configStore.js';

const FileTreeItem = ({ node, level = 0, selectedPaths, expandedPaths, pinnedPaths, isCopyMode, onCopyPath, onToggleSelection, onToggleExpansion, onTogglePin, searchTerm }) => {
  const { compactMode } = useConfigStore();
  const theme = useTheme();

  const isExpanded = (searchTerm && searchTerm.length > 0) || expandedPaths.has(node.path);
  const isPinned = node.type === 'file' && pinnedPaths.has(node.path);

  const getAllChildrenPaths = (n) => [
    ...(n.type === 'file' ? [n.path] : []),
    ...(n.children ? n.children.flatMap(getAllChildrenPaths) : [])
  ];

  const allDescendants = getAllChildrenPaths(node);
  const selectedDescendantsCount = allDescendants.filter(p => selectedPaths.has(p)).length;
  const isFullySelected = allDescendants.length > 0 && selectedDescendantsCount === allDescendants.length;
  const isPartiallySelected = selectedDescendantsCount > 0 && selectedDescendantsCount < allDescendants.length;
  const isSelected = selectedPaths.has(node.path) || isFullySelected;

  const checkVisibility = (n, term) => n.name.toLowerCase().includes(term.toLowerCase()) || (n.children ? n.children.some(c => checkVisibility(c, term)) : false);

  const isVisible = () => {
    if (!searchTerm) return true;
    if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    if (node.children) return node.children.some(child => checkVisibility(child, searchTerm));
    return false;
  };

  if (!isVisible()) return null;

  const handleExpandClick = (e) => {
    e.stopPropagation();
    onToggleExpansion(node.path);
  };

  const handleItemClick = (e) => {
    if (e.target.closest('.action-btn')) return;
    if (isCopyMode) return onCopyPath(node.path);
    const shouldSelect = selectedDescendantsCount === 0;
    onToggleSelection(node, shouldSelect);
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    const shouldSelect = selectedDescendantsCount === 0;
    onToggleSelection(node, shouldSelect);
  };

  const itemPaddingY = compactMode ? 0 : 0.5;
  const fontSize = compactMode ? '0.8rem' : '0.875rem';
  const iconSize = compactMode ? 18 : 20;

  return (
    <Box>
      <Box
        onClick={handleItemClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: itemPaddingY,
          pr: 1,
          pl: 1 + (level * 1.5),
          width: '100%',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          bgcolor: isSelected || isPartiallySelected ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
          minHeight: compactMode ? 24 : 32,
          '&:hover': { bgcolor: 'action.hover' },
          '&:hover .star-btn': { opacity: isPinned ? 1 : 0.4 }
        }}
      >
        {node.type === 'directory' ? (
          <IconButton
            className="action-btn"
            size="small"
            onClick={handleExpandClick}
            sx={{ p: 0.5, mr: 0.5 }}
          >
            {isExpanded ? <KeyboardArrowDown sx={{ fontSize: iconSize }} /> : <KeyboardArrowRight sx={{ fontSize: iconSize }} />}
          </IconButton>
        ) : (
          <Box sx={{ width: 24, mr: 0.5 }} />
        )}

        {!isCopyMode && (
          <Checkbox
            size="small"
            checked={isSelected}
            indeterminate={isPartiallySelected}
            onChange={handleCheckboxChange}
            sx={{ p: 0.5, '& .MuiSvgIcon-root': { fontSize: iconSize } }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, overflow: 'hidden', flexGrow: 1 }}>
            {node.type === 'directory' ?
                (isExpanded ? <FolderOpen sx={{ mr: 1, color: 'text.secondary', fontSize: iconSize }} /> : <Folder sx={{ mr: 1, color: 'text.secondary', fontSize: iconSize }} />)
                :
                <Box sx={{ mr: 1, display: 'flex' }}>
                    <FileIcon fileName={node.name} sx={{ fontSize: iconSize }} />
                </Box>
            }
            <Typography variant="body2" noWrap title={node.name} sx={{ fontSize }}>
                {node.name}
            </Typography>
            {node.type === 'file' && node.lines && !compactMode && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({node.lines}L)
                </Typography>
            )}
        </Box>

        {!isCopyMode && node.type === 'file' && (
            <IconButton
                className="action-btn star-btn"
                size="small"
                onClick={(e) => { e.stopPropagation(); onTogglePin(node.path); }}
                sx={{ p: 0.25, ml: 1, opacity: isPinned ? 1 : 0, transition: 'opacity 0.2s' }}
            >
                {isPinned ? <Star sx={{ fontSize: iconSize - 2, color: 'warning.main' }} /> : <StarOutline sx={{ fontSize: iconSize - 2, color: 'text.secondary' }} />}
            </IconButton>
        )}
      </Box>

      {node.children && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              selectedPaths={selectedPaths}
              expandedPaths={expandedPaths}
              pinnedPaths={pinnedPaths}
              isCopyMode={isCopyMode}
              onCopyPath={onCopyPath}
              onToggleSelection={onToggleSelection}
              onToggleExpansion={onToggleExpansion}
              onTogglePin={onTogglePin}
              searchTerm={searchTerm}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
};

export default FileTreeItem;