import { Typography, Tooltip, List } from '@mui/material'
import { MdTerminal } from 'react-icons/md'

import { CommandBox, StyledPaper, HeaderBox, StyledList, StyledListItem, ItemContentBox, CommandCheckbox, TextWrapperBox, HeaderTitle, CommandText } from './styles'
import ActionButton from '@/sidebar/components/actionButton'

import type { CommandActionsProps } from './types'

const CommandActions = ({ commandsToExecute, selectedCommands, toggleCommandSelection, handleExecuteCommands, actionLoading, serverStatus }: CommandActionsProps) => {
    if (!commandsToExecute || commandsToExecute.length === 0) return null

    return (
        <CommandBox>
            <StyledPaper elevation={0} variant="outlined">
                <HeaderBox>
                    <HeaderTitle variant="caption">
                        COMANDOS PARA EXECUTAR ({selectedCommands.size}/{commandsToExecute.length})
                    </HeaderTitle>
                </HeaderBox>
                
                <StyledList component={List}>
                    {commandsToExecute.map((command, index) => (
                        <StyledListItem
                            key={`cmd-${index}`}
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
                                        <CommandText variant="body2" noWrap>
                                            $ {command}
                                        </CommandText>
                                    </Tooltip>
                                </TextWrapperBox>
                            </ItemContentBox>
                        </StyledListItem>
                    ))}
                </StyledList>
            </StyledPaper>

            <ActionButton
                variant="contained"
                color="info"
                icon={<MdTerminal size={20} />}
                onClick={handleExecuteCommands}
                disabled={actionLoading || selectedCommands.size === 0 || serverStatus !== 'connected'}
                loading={actionLoading}
                fullWidth
            >
                Executar Comandos
            </ActionButton>
        </CommandBox>
    )
}

export default CommandActions