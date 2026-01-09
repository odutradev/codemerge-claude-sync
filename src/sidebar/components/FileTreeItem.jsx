import React, { useState, useEffect } from 'react';
import { Box, Checkbox, Typography, IconButton, Collapse } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import JavascriptIcon from '@mui/icons-material/Javascript';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import CodeIcon from '@mui/icons-material/Code';

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'js': return <JavascriptIcon sx={{ color: '#f7df1e' }} fontSize="small" />;
    case 'ts': return <CodeIcon sx={{ color: '#3178c6' }} fontSize="small" />;
    case 'jsx': return <CodeIcon sx={{ color: '#61dafb' }} fontSize="small" />;
    case 'tsx': return <CodeIcon sx={{ color: '#3178c6' }} fontSize="small" />;
    case 'html': return <HtmlIcon sx={{ color: '#e34c26' }} fontSize="small" />;
    case 'css': return <CssIcon sx={{ color: '#264de4' }} fontSize="small" />;
    case 'json': return <CodeIcon sx={{ color: '#ffd700' }} fontSize="small" />;
    default: return <InsertDriveFileIcon fontSize="small" color="disabled" />;
  }
};

const FileTreeItem = ({ node, level = 0, selectedPaths, onToggleSelection, searchTerm }) => {
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) {
      setExpanded(true);
    }
  }, [searchTerm]);

  const isSelected = selectedPaths.has(node.path);
  
  const isIndeterminate = () => {
    if (node.type !== 'directory') return false;
    const allChildrenPaths = getAllChildrenPaths(node);
    const selectedChildren = allChildrenPaths.filter(p => selectedPaths.has(p));
    return selectedChildren.length > 0 && selectedChildren.length < allChildrenPaths.length;
  };

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

  const handleToggle = () => setExpanded(!expanded);

  const handleCheckboxChange = () => {
    onToggleSelection(node, !isSelected);
  };

  return (
    <Box sx={{ pl: level > 0 ? 1.5 : 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5, '&:hover': { bgcolor: 'action.hover' } }}>
        {node.type === 'directory' ? (
          <IconButton size="small" onClick={handleToggle} sx={{ p: 0.5, mr: 0.5 }}>
            {expanded ? <KeyboardArrowDownIcon fontSize="small" /> : <KeyboardArrowRightIcon fontSize="small" />}
          </IconButton>
        ) : (
          <Box sx={{ width: 24, mr: 0.5 }} />
        )}

        <Checkbox
          size="small"
          checked={isSelected}
          indeterminate={isIndeterminate()}
          onChange={handleCheckboxChange}
          sx={{ p: 0.5 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, overflow: 'hidden' }}>
            {node.type === 'directory' ? 
                (expanded ? <FolderOpenIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> : <FolderIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />) 
                : 
                <Box sx={{ mr: 1, display: 'flex' }}>{getFileIcon(node.name)}</Box>
            }
            <Typography variant="body2" noWrap title={node.name}>
                {node.name}
            </Typography>
            {node.type === 'file' && node.lines && (
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