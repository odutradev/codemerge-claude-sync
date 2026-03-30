import { MdSettingsBrightness, MdLightMode, MdDarkMode, MdViewHeadline, MdViewCompact, MdNotifications, MdErrorOutline, MdNotificationsOff, MdPalette } from 'react-icons/md'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

import ColorPicker from '@/sidebar/tabs/settings/components/colorPicker'
import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import useConfigStore from '@/sidebar/stores/config'
import { ToggleContent } from '@/sidebar/tabs/settings/styles'

const PREDEFINED_COLORS = ['#da7756', '#2196f3', '#4caf50', '#9c27b0', '#f44336']

const Appearance = () => {
    const { themeMode, primaryColor, compactMode, verbosity, setThemeMode, setPrimaryColor, setCompactMode, setVerbosity } = useConfigStore()

    return (
        <Section title="Interface & UX" icon={<MdPalette size={20} />}>
            <Row label="Aparência" vertical>
                <ToggleButtonGroup value={themeMode} exclusive onChange={(_, v) => v && setThemeMode(v)} size="small" fullWidth>
                    <ToggleButton value="light">
                        <ToggleContent><MdLightMode size={20} /> Claro</ToggleContent>
                    </ToggleButton>
                    <ToggleButton value="system">
                        <ToggleContent><MdSettingsBrightness size={20} /> Auto</ToggleContent>
                    </ToggleButton>
                    <ToggleButton value="dark">
                        <ToggleContent><MdDarkMode size={20} /> Escuro</ToggleContent>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>

            <Row label="Densidade" vertical>
                <ToggleButtonGroup value={compactMode ? 'compact' : 'normal'} exclusive onChange={(_, v) => v && setCompactMode(v === 'compact')} size="small" fullWidth>
                    <ToggleButton value="normal">
                        <ToggleContent><MdViewHeadline size={20} /> Normal</ToggleContent>
                    </ToggleButton>
                    <ToggleButton value="compact">
                        <ToggleContent><MdViewCompact size={20} /> Compacto</ToggleContent>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>

            <Row label="Notificações" vertical>
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

            <Row label="Cor Principal" vertical>
                <ColorPicker
                    value={primaryColor}
                    predefinedColors={PREDEFINED_COLORS}
                    onChange={setPrimaryColor}
                />
            </Row>
        </Section>
    )
}

export default Appearance