import { MdNotifications, MdErrorOutline, MdNotificationsOff } from 'react-icons/md'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import { ToggleContent } from '@/sidebar/tabs/settings/styles'
import useConfigStore from '@/sidebar/stores/config'

const Notifications = () => {
    const { verbosity, setVerbosity } = useConfigStore()

    return (
        <Section title="Notificações" icon={<MdNotifications size={20} />} tooltip="Configure o nível de verbosidade dos alertas e notificações no sistema.">
            <Row label="Verbosidade" vertical>
                <ToggleButtonGroup value={verbosity} exclusive onChange={(_, v) => v && setVerbosity(v)} size="small" fullWidth>
                    <ToggleButton value="all">
                        <ToggleContent><MdNotifications size={20} /> Tudo</ToggleContent>
                    </ToggleButton>
                    <ToggleButton value="errors">
                        <ToggleContent><MdErrorOutline size={20} /> Erros</ToggleContent>
                    </ToggleButton>
                    <ToggleButton value="silent">
                        <ToggleContent><MdNotificationsOff size={20} /> Mudo</ToggleContent>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>
        </Section>
    )
}

export default Notifications