import { Box, Typography, Button, List, ListItem, Checkbox, Paper, Tooltip } from '@mui/material';
import { MdTerminal } from 'react-icons/md';

import { paperStyles, headerBoxStyles, listItemStyles } from './styles';

interface Props { commandsToExecute: string[]; selectedCommands: Set<string>; toggleCommandSelection: (cmd: string) => void; handleExecuteCommands: () => void; actionLoading: boolean; serverStatus: string; }

export const CommandActions = ({ commandsToExecute, selectedCommands, toggleCommandSelection, handleExecuteCommands, actionLoading, serverStatus }: Props) => {
    if (!commandsToExecute || commandsToExecute.length === 0) return null;
    return (
        <Box sx={{ mb: 2 }}>
            <Paper elevation={0} variant="outlined" sx={paperStyles}>
                <Box sx={headerBoxStyles}><Typography variant="caption" sx={{ fontWeight: 600, color: 'info.main' }}>COMANDOS PARA EXECUTAR ({selectedCommands.size}/{commandsToExecute.length})</Typography></Box>
                <List sx={{ p: 1, maxHeight: 150, overflowY: 'auto' }}>
                    {commandsToExecute.map((cmd, index) => (
                        <ListItem key={`cmd-${index}`} button onClick={() => toggleCommandSelection(cmd)} sx={listItemStyles(selectedCommands.has(cmd))}>
                            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, width: '100%' }}><Checkbox checked={selectedCommands.has(cmd)} size="small" sx={{ p: 0.5, mr: 1.5, color: 'info.main', '&.Mui-checked': { color: 'info.main' } }} /><Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}><Tooltip title={cmd} placement="top-start" enterDelay={500}><Typography variant="body2" noWrap sx={{ color: 'text.primary', fontFamily: 'monospace', fontSize: '0.75rem' }}>$ {cmd}</Typography></Tooltip></Box></Box>
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Button variant="contained" color="info" onClick={handleExecuteCommands} disabled={actionLoading || selectedCommands.size === 0 || serverStatus !== 'connected'} fullWidth disableElevation startIcon={<MdTerminal size={20} />} sx={{ textTransform: 'none', py: 1, borderRadius: 2 }}>Executar Comandos</Button>
        </Box>
    );
};