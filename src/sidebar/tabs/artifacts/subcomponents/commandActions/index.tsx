import { Typography, Tooltip, List } from '@mui/material';
import { MdTerminal } from 'react-icons/md';

import { CommandBox, StyledPaper, HeaderBox, StyledList, StyledListItem, ItemContentBox, CommandCheckbox, TextWrapperBox, ExecuteButton } from './styles';

import type { CommandActionsProps } from './types';

const CommandActions = ({ commandsToExecute, selectedCommands, toggleCommandSelection, handleExecuteCommands, actionLoading, serverStatus }: CommandActionsProps) => {
    if (!commandsToExecute || commandsToExecute.length === 0) {
        return null;
    }

    return (
        <CommandBox>
            <StyledPaper elevation={0} variant="outlined">
                <HeaderBox>
                    <Typography variant="caption" style={{ fontWeight: 600, color: '#0288d1' }}>
                        COMANDOS PARA EXECUTAR ({selectedCommands.size}/{commandsToExecute.length})
                    </Typography>
                </HeaderBox>
                
                <StyledList component={List}>
                    {commandsToExecute.map((command, index) => (
                        <StyledListItem
                            key={`cmd-${index}`}
                            button
                            onClick={() => toggleCommandSelection(command)}
                            isSelected={selectedCommands.has(command)}
                        >
                            <ItemContentBox>
                                <CommandCheckbox
                                    checked={selectedCommands.has(command)}
                                    size="small"
                                />
                                <TextWrapperBox>
                                    <Tooltip title={command} placement="top-start" enterDelay={500}>
                                        <Typography variant="body2" noWrap style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                            $ {command}
                                        </Typography>
                                    </Tooltip>
                                </TextWrapperBox>
                            </ItemContentBox>
                        </StyledListItem>
                    ))}
                </StyledList>
            </StyledPaper>

            <ExecuteButton
                variant="contained"
                color="info"
                onClick={handleExecuteCommands}
                disabled={actionLoading || selectedCommands.size === 0 || serverStatus !== 'connected'}
                fullWidth
                disableElevation
                startIcon={<MdTerminal size={20} />}
            >
                Executar Comandos
            </ExecuteButton>
        </CommandBox>
    );
};

export default CommandActions;