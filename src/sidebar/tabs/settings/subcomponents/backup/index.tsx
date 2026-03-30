import { MdBackup, MdDownload, MdUpload } from 'react-icons/md'
import { useRef } from 'react'

import { BackupRow, BackupInfo, BackupTitle, BackupDesc, HiddenInput, ActionGroup, StyledButton } from './styles'
import useNotificationStore from '@/sidebar/stores/notification'
import Section from '@/sidebar/tabs/settings/components/section'
import useConfigStore from '@/sidebar/stores/config'
import usePromptStore from '@/sidebar/stores/prompt'

import type { BackupData } from './types'

const Backup = () => {
    const { showNotification } = useNotificationStore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleExport = () => {
        const config = useConfigStore.getState()
        const { presets } = usePromptStore.getState()

        const dataToExport: BackupData = {
            codemergeBackup: true,
            version: 1,
            config: {
                serverUrl: config.serverUrl,
                checkInterval: config.checkInterval,
                themeMode: config.themeMode,
                primaryColor: config.primaryColor,
                compactMode: config.compactMode,
                verbosity: config.verbosity,
                persistSelection: config.persistSelection,
                removeComments: config.removeComments,
                removeEmptyLines: config.removeEmptyLines,
                removeLogs: config.removeLogs,
                translateCommit: config.translateCommit,
                showCommitFeedback: config.showCommitFeedback,
                showExecuteFeedback: config.showExecuteFeedback,
                autoSelectSynced: config.autoSelectSynced
            },
            presets: presets.map(({ title, prompt }) => ({ title, prompt }))
        }

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download = `codemerge-sync-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string) as BackupData

                if (!parsed.codemergeBackup) {
                    showNotification('Arquivo de backup inválido', 'error')
                    return
                }

                const { setServerUrl, setCheckInterval, setThemeMode, setPrimaryColor, setCompactMode, setVerbosity, setPersistSelection, setRemoveComments, setRemoveEmptyLines, setRemoveLogs, setTranslateCommit, setShowCommitFeedback, setShowExecuteFeedback, setAutoSelectSynced } = useConfigStore.getState()

                if (parsed.config) {
                    const c = parsed.config
                    if (c.serverUrl !== undefined) setServerUrl(c.serverUrl)
                    if (c.checkInterval !== undefined) setCheckInterval(c.checkInterval)
                    if (c.themeMode !== undefined) setThemeMode(c.themeMode)
                    if (c.primaryColor !== undefined) setPrimaryColor(c.primaryColor)
                    if (c.compactMode !== undefined) setCompactMode(c.compactMode)
                    if (c.verbosity !== undefined) setVerbosity(c.verbosity)
                    if (c.persistSelection !== undefined) setPersistSelection(c.persistSelection)
                    if (c.removeComments !== undefined) setRemoveComments(c.removeComments)
                    if (c.removeEmptyLines !== undefined) setRemoveEmptyLines(c.removeEmptyLines)
                    if (c.removeLogs !== undefined) setRemoveLogs(c.removeLogs)
                    if (c.translateCommit !== undefined) setTranslateCommit(c.translateCommit)
                    if (c.showCommitFeedback !== undefined) setShowCommitFeedback(c.showCommitFeedback)
                    if (c.showExecuteFeedback !== undefined) setShowExecuteFeedback(c.showExecuteFeedback)
                    if (c.autoSelectSynced !== undefined) setAutoSelectSynced(c.autoSelectSynced)
                }

                if (parsed.presets && Array.isArray(parsed.presets)) {
                    const { presets, deletePreset, addPreset } = usePromptStore.getState()
                    presets.forEach((p) => deletePreset(p.id))
                    parsed.presets.forEach((p) => addPreset({ title: p.title, prompt: p.prompt }))
                }

                showNotification('Backup restaurado com sucesso!', 'success')
            } catch {
                showNotification('Falha ao processar arquivo de backup', 'error')
            }
        }

        reader.readAsText(file)
        e.target.value = ''
    }

    return (
        <Section title="Backup & Restauração" icon={<MdBackup size={20} />} tooltip="Exporte ou importe suas configurações e prompts de forma segura.">
            <BackupRow>
                <BackupInfo>
                    <BackupTitle>Importar e Exportar Dados</BackupTitle>
                    <BackupDesc>Salve um arquivo JSON local ou carregue um arquivo existente.</BackupDesc>
                </BackupInfo>
                <ActionGroup>
                    <StyledButton variant="outlined" startIcon={<MdUpload size={18} />} onClick={() => fileInputRef.current?.click()} size="small">
                        Importar
                    </StyledButton>
                    <StyledButton variant="contained" color="primary" startIcon={<MdDownload size={18} />} onClick={handleExport} size="small">
                        Exportar
                    </StyledButton>
                </ActionGroup>
                <HiddenInput type="file" accept=".json" ref={fileInputRef} onChange={handleImport} />
            </BackupRow>
        </Section>
    )
}

export default Backup