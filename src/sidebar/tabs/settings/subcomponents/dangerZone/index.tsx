import { MdWarning } from 'react-icons/md'
import { Button } from '@mui/material'

import useNotificationStore from '@/sidebar/stores/notification'
import Section from '@/sidebar/tabs/settings/components/section'
import useSelectionStore from '@/sidebar/stores/selection'
import useHistoryStore from '@/sidebar/stores/history'
import useConfigStore from '@/sidebar/stores/config'
import { DangerRow, DangerInfo, DangerActionTitle, DangerActionDesc } from './styles'

const DangerZone = () => {
    const { showNotification } = useNotificationStore()
    const { clearAllSelections } = useSelectionStore()
    const { clearAllHistory } = useHistoryStore()
    const { resetConfig } = useConfigStore()

    const handleClearSelections = () => {
        clearAllSelections()
        showNotification('Cache de seleções limpo', 'success')
    }

    const handleClearHistory = () => {
        clearAllHistory()
        showNotification('Histórico limpo', 'success')
    }

    const handleReset = () => {
        resetConfig()
        showNotification('Configurações restauradas', 'success')
    }

    const handleClearAll = () => {
        clearAllSelections()
        clearAllHistory()
        showNotification('Todo o cache foi apagado', 'success')
    }

    return (
        <Section title="Zona de Perigo" icon={<MdWarning size={20} />} borderColor="error.main" tooltip="Ações irreversíveis que apagam dados locais, caches e restauram as configurações.">
            <DangerRow>
                <DangerInfo>
                    <DangerActionTitle>Limpar cache de seleções</DangerActionTitle>
                    <DangerActionDesc>Remove as seleções de arquivos ativas. O histórico permanecerá intacto.</DangerActionDesc>
                </DangerInfo>
                <Button variant="outlined" color="warning" onClick={handleClearSelections} size="small">
                    Limpar seleções
                </Button>
            </DangerRow>
            <DangerRow>
                <DangerInfo>
                    <DangerActionTitle>Limpar histórico de artefatos</DangerActionTitle>
                    <DangerActionDesc>Apaga os registros e artefatos previamente gerados e sincronizados.</DangerActionDesc>
                </DangerInfo>
                <Button variant="outlined" color="warning" onClick={handleClearHistory} size="small">
                    Limpar histórico
                </Button>
            </DangerRow>
            <DangerRow>
                <DangerInfo>
                    <DangerActionTitle>Restaurar configurações</DangerActionTitle>
                    <DangerActionDesc>Reverte as configurações e preferências visuais para o padrão de fábrica.</DangerActionDesc>
                </DangerInfo>
                <Button variant="outlined" color="error" onClick={handleReset} size="small">
                    Restaurar
                </Button>
            </DangerRow>
            <DangerRow>
                <DangerInfo>
                    <DangerActionTitle>Apagar todos os dados</DangerActionTitle>
                    <DangerActionDesc>Depois de apagar todo o cache, não há como voltar atrás. Por favor, tenha certeza.</DangerActionDesc>
                </DangerInfo>
                <Button variant="outlined" color="error" onClick={handleClearAll} size="small">
                    Apagar dados
                </Button>
            </DangerRow>
        </Section>
    )
}

export default DangerZone