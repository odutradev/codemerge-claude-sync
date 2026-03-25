import { Box, Typography, List, ListItem, Checkbox, IconButton, Tooltip } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';

import FileIcon from '../../../../components/fileIcon/index.jsx';
import { headerBoxStyles, listItemStyles } from './styles.js';

export const PinnedList = ({ pinnedPaths, selectedPaths, onToggleSelection, onTogglePin }) => {
    if (!pinnedPaths || pinnedPaths.size === 0) return null;

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={headerBoxStyles}>
                <PushPinIcon sx={{ fontSize: 14, mr: 0.5 }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    FAVORITOS ({pinnedPaths.size})
                </Typography>
            </Box>
            <List sx={{ p: 0, maxHeight: 150, overflowY: 'auto' }}>
                {Array.from(pinnedPaths).map(path => {
                    const isSelected = selectedPaths.has(path);
                    const fileName = path.split('/').pop();
                    return (
                        <ListItem key={`pin-${path}`} sx={listItemStyles(isSelected)} onClick={() => onToggleSelection({ path, type: 'file' }, !isSelected)}>
                            <Checkbox checked={isSelected} size="small" sx={{ p: 0.5, mr: 1 }} disableRipple />
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, width: 20, height: 20 }}>
                                <FileIcon fileName={fileName} />
                            </Box>
                            <Typography variant="body2" noWrap sx={{ flexGrow: 1, fontSize: '0.8rem' }} title={path}>
                                {fileName}
                            </Typography>
                            <Tooltip title="Remover dos favoritos">
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onTogglePin(path); }} sx={{ ml: 1, p: 0.5 }}>
                                    <PushPinIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
};