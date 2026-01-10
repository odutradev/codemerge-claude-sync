import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Typography, IconButton, Collapse } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import FileIcon from '../../../../components/fileIcon/index.jsx';
import useConfigStore from '../../../../store/configStore.js';

const FileTreeItem = ({ node, level = 0, selectedPaths, onToggleSelection, searchTerm }) => {
  const [expanded, setExpanded] = useState(false);
  const { compactMode } = useConfigStore();
  const theme = useTheme();
  
  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) {
      setExpanded(true);
    }
  }, [searchTerm]);

  const getAllChildrenPaths = (n) => {
    let paths = [];
    if (n.type === 'file') paths.push(n.path);
    if (n.children) {
      n.children.forEach(child => {
        paths = [...paths, ...getAllChildrenPaths(child)];
      });
    }
    return paths;
  };

  const allDescendants = getAllChildrenPaths(node);
  const selectedDescendantsCount = allDescendants.filter(p => selectedPaths.has(p)).length;
  
  const isFullySelected = allDescendants.length > 0 && selectedDescendantsCount === allDescendants.length;
  const isPartiallySelected = selectedDescendantsCount > 0 && selectedDescendantsCount < allDescendants.length;
  const isSelected = selectedPaths.has(node.path) || isFullySelected;

  const isVisible = () => {
    if (!searchTerm) return true;
    if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    if (node.children) {
      return node.children.some(child => checkVisibility(child, searchTerm));
    }
    return false;
  };

  const checkVisibility = (n, term) => {
    if (n.name.toLowerCase().includes(term.toLowerCase())) return true;
    if (n.children) return n.children.some(c => checkVisibility(c, term));
    return false;
  };

  if (!isVisible()) return null;

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleItemClick = (e) => {
    if (e.target.closest('.expand-icon')) return;
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
          '&:hover': { bgcolor: 'action.hover' },
          bgcolor: isSelected || isPartiallySelected ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
          minHeight: compactMode ? 24 : 32
        }}
      >
        {node.type === 'directory' ? (
          <IconButton 
            className="expand-icon"
            size="small" 
            onClick={handleExpandClick} 
            sx={{ p: 0.5, mr: 0.5 }}
          >
            {expanded ? <KeyboardArrowDownIcon sx={{ fontSize: iconSize }} /> : <KeyboardArrowRightIcon sx={{ fontSize: iconSize }} />}
          </IconButton>
        ) : (
          <Box sx={{ width: 24, mr: 0.5 }} />
        )}

        <Checkbox
          size="small"
          checked={isSelected}
          indeterminate={isPartiallySelected}
          onChange={handleCheckboxChange}
          sx={{ p: 0.5, '& .MuiSvgIcon-root': { fontSize: iconSize } }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, overflow: 'hidden' }}>
            {node.type === 'directory' ? 
                (expanded ? <FolderOpenIcon sx={{ mr: 1, color: 'text.secondary', fontSize: iconSize }} /> : <FolderIcon sx={{ mr: 1, color: 'text.secondary', fontSize: iconSize }} />) 
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
      </Box>

      {node.children && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {node.children.map((child) => (
            <FileTreeItem 
              key={child.path} 
              node={child} 
              level={level + 1} 
              selectedPaths={selectedPaths}
              onToggleSelection={onToggleSelection}
              searchTerm={searchTerm}
            />
          ))}
        </Collapse>
      )}
    </Box>
  );
};

export default FileTreeItem;