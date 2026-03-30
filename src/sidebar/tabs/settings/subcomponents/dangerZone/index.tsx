import { MdDeleteForever, MdDeleteSweep, MdHistory, MdRestore, MdWarning } from 'react-icons/md'
import { Button } from '@mui/material'

import Section from '@/sidebar/tabs/settings/components/section'
import useNotificationStore from '@/sidebar/stores/notification'
import useSelectionStore from '@/sidebar/stores/selection'
import useHistoryStore from '@/sidebar/stores/history'
import useConfigStore from '@/sidebar/stores/config'
import { ActionGrid, WarningText } from './styles'

const DangerZone = () => {
    const { showNotification } = useNotificationStore()
    const { clearAllSelections } = useSelectionStore()
    const { clearAllHistory } = useHistoryStore()
    const { resetConfig } = useConfigStore()

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
        <Section title="Ações Críticas" icon={<MdWarning size={20} />} borderColor="error.main">
            <WarningText variant="caption">
                Atenção: As ações abaixo são irreversíveis e afetam o estado armazenado localmente na extensão.
            </WarningText>
            <ActionGrid>
                <Button variant="outlined" color="warning" startIcon={<MdDeleteSweep size={20} />} onClick={handleClearSelections} size="small" fullWidth>
                    Limpar Seleções
                </Button>
                <Button variant="outlined" color="warning" startIcon={<MdHistory size={20} />} onClick={handleClearHistory} size="small" fullWidth>
                    Limpar Histórico
                </Button>
                <Button variant="outlined" color="error" startIcon={<MdDeleteForever size={20} />} onClick={handleClearAll} size="small" fullWidth>
                    Apagar Cache
                </Button>
                <Button variant="outlined" color="error" startIcon={<MdRestore size={20} />} onClick={handleReset} size="small" fullWidth>
                    Restaurar Padrões
                </Button>
            </ActionGrid>
        </Section>
    )
}

export default DangerZone