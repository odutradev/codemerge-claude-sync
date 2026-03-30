import { MdSettingsBrightness, MdLightMode, MdDarkMode, MdViewHeadline, MdViewCompact, MdPalette } from 'react-icons/md'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

import ColorPicker from '@/sidebar/tabs/settings/components/colorPicker'
import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import { ToggleContent } from '@/sidebar/tabs/settings/styles'
import useConfigStore from '@/sidebar/stores/config'

const PREDEFINED_COLORS = ['#da7756', '#2196f3', '#4caf50', '#9c27b0', '#f44336']

const Appearance = () => {
    const { themeMode, primaryColor, compactMode, setThemeMode, setPrimaryColor, setCompactMode } = useConfigStore()

    return (
        <Section title="Aparência & UX" icon={<MdPalette size={20} />} tooltip="Personalize as cores, o tema visual e a densidade dos elementos da interface.">
            <Row label="Tema" vertical>
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

            <Row label="Cor Principal" vertical>
                <ColorPicker value={primaryColor} predefinedColors={PREDEFINED_COLORS} onChange={setPrimaryColor} />
            </Row>
        </Section>
    )
}

export default Appearance