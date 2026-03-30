import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import Notifications from '@/sidebar/tabs/settings/subcomponents/notifications'
import CommandOutput from '@/sidebar/tabs/settings/subcomponents/commandOutput'
import CodeCleanup from '@/sidebar/tabs/settings/subcomponents/codeCleanup'
import DangerZone from '@/sidebar/tabs/settings/subcomponents/dangerZone'
import Appearance from '@/sidebar/tabs/settings/subcomponents/appearance'
import { SettingsContainer, VersionText, StatusWrapper } from './styles'
import GitConfig from '@/sidebar/tabs/settings/subcomponents/gitConfig'
import DataStore from '@/sidebar/tabs/settings/subcomponents/dataStore'
import DataSync from '@/sidebar/tabs/settings/subcomponents/dataSync'
import Creator from '@/sidebar/tabs/settings/subcomponents/creator'
import Backup from '@/sidebar/tabs/settings/subcomponents/backup'
import { useServerStatus } from '@/sidebar/hooks/useServerStatus'
import { useSettings } from '@/sidebar/tabs/settings/hooks'
import useConfigStore from '@/sidebar/stores/config'

import type { FetchViaBackground } from '@/sidebar/types'
import type { SettingsViewProps } from './types'

const SettingsView = ({ fetchViaBackground }: SettingsViewProps) => {
    const { serverUrl, checkInterval } = useConfigStore()
    const fallbackFetch: FetchViaBackground = async () => ({ success: false })
    const { serverStatus, isChecking } = useServerStatus(serverUrl, checkInterval, fetchViaBackground ?? fallbackFetch)
    const { state } = useSettings()

    return (
        <SettingsContainer>
            <StatusWrapper>
                <ServerStatusIndicator status={serverStatus} isChecking={isChecking} />
            </StatusWrapper>

            <Appearance />
            <Notifications />
            <GitConfig />
            <CommandOutput />
            <CodeCleanup />
            <DataStore />
            <DataSync />
            <Backup />
            <Creator />
            <DangerZone />

            <VersionText variant="caption">CodeMerge Sync v{state.version}</VersionText>
        </SettingsContainer>
    )
}

export default SettingsView