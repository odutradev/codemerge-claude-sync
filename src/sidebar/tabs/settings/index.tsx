import GitCommands from '@/sidebar/tabs/settings/subcomponents/gitCommands'
import CodeCleanup from '@/sidebar/tabs/settings/subcomponents/codeCleanup'
import DangerZone from '@/sidebar/tabs/settings/subcomponents/dangerZone'
import Appearance from '@/sidebar/tabs/settings/subcomponents/appearance'
import DataSync from '@/sidebar/tabs/settings/subcomponents/dataSync'
import { SettingsContainer, PageTitle, VersionText } from './styles'
import { useSettings } from '@/sidebar/tabs/settings/hooks'

import type { SettingsViewProps } from './types'

const SettingsView = ({ fetchViaBackground }: SettingsViewProps) => {
    const { state } = useSettings()

    return (
        <SettingsContainer>
            <PageTitle variant="h6">Configurações</PageTitle>

            <Appearance />
            <GitCommands />
            <CodeCleanup />
            <DataSync />
            <DangerZone />

            <VersionText variant="caption">CodeMerge Sync v{state.version}</VersionText>
        </SettingsContainer>
    )
}

export default SettingsView