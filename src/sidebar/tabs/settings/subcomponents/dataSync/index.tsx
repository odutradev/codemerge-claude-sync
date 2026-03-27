import { MdOutlinePushPin, MdLibraryAddCheck, MdDeleteForever, MdDeleteSweep, MdPushPin, MdHistory, MdRestore, MdTimer, MdLink } from 'react-icons/md'
import { ToggleButtonGroup, InputAdornment, ToggleButton, Button } from '@mui/material'

import { SyncContainer, HeaderText, SectionContainer, SectionLabel, IconWrapper, ActionContainer, StyledDivider, IntervalInput, UrlInput } from './styles'
import useNotificationStore from '@/sidebar/stores/notification'
import useSelectionStore from '@/sidebar/stores/selection'
import useHistoryStore from '@/sidebar/stores/history'
import useConfigStore from '@/sidebar/stores/config'

const DataSync = () => {
    const { serverUrl, checkInterval, persistSelection, autoSelectSynced, setServerUrl, setCheckInterval, setPersistSelection, setAutoSelectSynced, resetConfig } = useConfigStore()
    const { showNotification } = useNotificationStore()
    const { clearAllSelections } = useSelectionStore()
    const { clearAllHistory } = useHistoryStore()

    const handleReset = () => {
        resetConfig()
        showNotification('Configurações restauradas', 'success')
    }

    const handleClearSelections = () => {
        clearAllSelections()
        showNotification('Cache de seleções limpo', 'success')
    }

    const handleClearHistory = () => {
        clearAllHistory()
        showNotification('Histórico limpo', 'success')
    }

    const handleClearAll = () => {
        clearAllSelections()
        clearAllHistory()
        showNotification('Todo cache limpo', 'success')
    }

    return (
        <SyncContainer variant="outlined">
            <HeaderText variant="subtitle2">
                Dados & Sincronização
            </HeaderText>

            <SectionContainer>
                <SectionLabel variant="caption">
                    URL do Servidor
                </SectionLabel>
                <UrlInput
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdLink size={20} />
                            </InputAdornment>
                        )
                    }}
                />
            </SectionContainer>

            <SectionContainer>
                <SectionLabel variant="caption">
                    Persistência
                </SectionLabel>
                <ToggleButtonGroup
                    value={persistSelection ? 'on' : 'off'}
                    exclusive
                    onChange={(_, v) => v && setPersistSelection(v === 'on')}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="off">
                        <IconWrapper>
                            <MdOutlinePushPin size={20} />
                        </IconWrapper>
                        Volátil
                    </ToggleButton>
                    <ToggleButton value="on">
                        <IconWrapper>
                            <MdPushPin size={20} />
                        </IconWrapper>
                        Manter Seleção
                    </ToggleButton>
                </ToggleButtonGroup>
            </SectionContainer>

            <SectionContainer>
                <SectionLabel variant="caption">
                    Auto-selecionar Artefatos
                </SectionLabel>
                <ToggleButtonGroup
                    value={autoSelectSynced ? 'on' : 'off'}
                    exclusive
                    onChange={(_, v) => v && setAutoSelectSynced(v === 'on')}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="off">
                        Inativo
                    </ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <IconWrapper>
                            <MdLibraryAddCheck size={20} />
                        </IconWrapper>
                        Ativo
                    </ToggleButton>
                </ToggleButtonGroup>
            </SectionContainer>

            <ActionContainer>
                <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<MdDeleteSweep size={20} />}
                    onClick={handleClearSelections}
                    fullWidth
                    size="small"
                >
                    Limpar Cache de Seleções
                </Button>
                <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<MdHistory size={20} />}
                    onClick={handleClearHistory}
                    fullWidth
                    size="small"
                >
                    Limpar Histórico de Artefatos
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<MdDeleteForever size={20} />}
                    onClick={handleClearAll}
                    fullWidth
                    size="small"
                >
                    Limpar Todo o Cache
                </Button>
            </ActionContainer>

            <StyledDivider />

            <SectionLabel variant="caption">
                Check Interval (ms)
            </SectionLabel>
            <IntervalInput
                fullWidth
                variant="outlined"
                size="small"
                type="number"
                value={checkInterval}
                onChange={(e) => setCheckInterval(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <MdTimer size={20} />
                        </InputAdornment>
                    )
                }}
            />

            <Button
                variant="outlined"
                color="error"
                startIcon={<MdRestore size={20} />}
                onClick={handleReset}
                fullWidth
                size="small"
            >
                Restaurar Padrões
            </Button>
        </SyncContainer>
    )
}

export default DataSync