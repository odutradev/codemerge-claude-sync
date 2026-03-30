import { MdBackup, MdDownload, MdUpload } from 'react-icons/md'
import { useRef } from 'react'

import { BackupRow, BackupInfo, BackupTitle, BackupDesc, HiddenInput, ActionGroup, StyledButton } from './styles'
import useNotificationStore from '@/sidebar/stores/notification'
import Section from '@/sidebar/tabs/settings/components/section'
import useConfigStore from '@/sidebar/stores/config'
import usePromptStore from '@/sidebar/stores/prompt'

import type { ConfigBackupData, PresetBackupData } from './types'

const Backup = () => {
    const { showNotification } = useNotificationStore()
    const configInputRef = useRef<HTMLInputElement>(null)
    const presetInputRef = useRef<HTMLInputElement>(null)

    const handleExportConfig = () => {
        const config = useConfigStore.getState()

        const dataToExport: ConfigBackupData = {
            codemergeConfigBackup: true,
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
            }
        }

        downloadBlob(dataToExport, 'config-backup')
    }

    const handleExportPresets = () => {
        const { presets } = usePromptStore.getState()

        const dataToExport: PresetBackupData = {
            codemergePresetBackup: true,
            version: 1,
            presets: presets.map(({ title, prompt }) => ({ title, prompt }))
        }

        downloadBlob(dataToExport, 'presets-backup')
    }

    const downloadBlob = (data: unknown, prefix: string) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download = `codemerge-${prefix}-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string) as ConfigBackupData

                if (!parsed.codemergeConfigBackup) {
                    showNotification('Arquivo de backup de configurações inválido', 'error')
                    return
                }

                const { setServerUrl, setCheckInterval, setThemeMode, setPrimaryColor, setCompactMode, setVerbosity, setPersistSelection, setRemoveComments, setRemoveEmptyLines, setRemoveLogs, setTranslateCommit, setShowCommitFeedback, setShowExecuteFeedback, setAutoSelectSynced } = useConfigStore.getState()
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

                showNotification('Configurações restauradas com sucesso!', 'success')
            } catch {
                showNotification('Falha ao processar arquivo de configurações', 'error')
            }
        }

        reader.readAsText(file)
        e.target.value = ''
    }

    const handleImportPresets = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string) as PresetBackupData

                if (!parsed.codemergePresetBackup) {
                    showNotification('Arquivo de backup de presets inválido', 'error')
                    return
                }

                if (parsed.presets && Array.isArray(parsed.presets)) {
                    const { presets, deletePreset, addPreset } = usePromptStore.getState()
                    presets.forEach((p) => deletePreset(p.id))
                    parsed.presets.forEach((p) => addPreset({ title: p.title, prompt: p.prompt }))
                }

                showNotification('Presets restaurados com sucesso!', 'success')
            } catch {
                showNotification('Falha ao processar arquivo de presets', 'error')
            }
        }

        reader.readAsText(file)
        e.target.value = ''
    }

    return (
        <Section title="Backup & Restauração" icon={<MdBackup size={20} />} tooltip="Exporte ou importe suas configurações globais e presets de prompt separadamente.">
            <BackupRow>
                <BackupInfo>
                    <BackupTitle>Configurações do Sistema</BackupTitle>
                    <BackupDesc>Salva preferências visuais, atalhos e comportamentos globais.</BackupDesc>
                </BackupInfo>
                <ActionGroup>
                    <StyledButton variant="outlined" startIcon={<MdUpload size={18} />} onClick={() => configInputRef.current?.click()} size="small">
                        Importar
                    </StyledButton>
                    <StyledButton variant="contained" color="primary" startIcon={<MdDownload size={18} />} onClick={handleExportConfig} size="small">
                        Exportar
                    </StyledButton>
                </ActionGroup>
                <HiddenInput type="file" accept=".json" ref={configInputRef} onChange={handleImportConfig} />
            </BackupRow>

            <BackupRow>
                <BackupInfo>
                    <BackupTitle>Presets de Prompts</BackupTitle>
                    <BackupDesc>Salva seus templates personalizados de IA e instruções recorrentes.</BackupDesc>
                </BackupInfo>
                <ActionGroup>
                    <StyledButton variant="outlined" startIcon={<MdUpload size={18} />} onClick={() => presetInputRef.current?.click()} size="small">
                        Importar
                    </StyledButton>
                    <StyledButton variant="contained" color="primary" startIcon={<MdDownload size={18} />} onClick={handleExportPresets} size="small">
                        Exportar
                    </StyledButton>
                </ActionGroup>
                <HiddenInput type="file" accept=".json" ref={presetInputRef} onChange={handleImportPresets} />
            </BackupRow>
        </Section>
    )
}

export default Backup