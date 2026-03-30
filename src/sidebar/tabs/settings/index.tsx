import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import CommandOutput from '@/sidebar/tabs/settings/subcomponents/commandOutput'
import Notifications from '@/sidebar/tabs/settings/subcomponents/notifications'
import CodeCleanup from '@/sidebar/tabs/settings/subcomponents/codeCleanup'
import DangerZone from '@/sidebar/tabs/settings/subcomponents/dangerZone'
import Appearance from '@/sidebar/tabs/settings/subcomponents/appearance'
import DataStore from '@/sidebar/tabs/settings/subcomponents/dataStore'
import GitConfig from '@/sidebar/tabs/settings/subcomponents/gitConfig'
import DataSync from '@/sidebar/tabs/settings/subcomponents/dataSync'
import { SettingsContainer, VersionText, StatusWrapper } from './styles'
import { useServerStatus } from '@/sidebar/hooks/useServerStatus'
import { useSettings } from '@/sidebar/tabs/settings/hooks'
import useConfigStore from '@/sidebar/stores/config'

import type { SettingsViewProps } from './types'
import type { FetchViaBackground } from '@/sidebar/types'

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
            <DangerZone />

            <VersionText variant="caption">CodeMerge Sync v{state.version}</VersionText>
        </SettingsContainer>
    )
}

export default SettingsView