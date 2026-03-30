import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import { MdTranslate, MdCode } from 'react-icons/md'

import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import { ToggleContent } from '@/sidebar/tabs/settings/styles'
import useConfigStore from '@/sidebar/stores/config'

const GitConfig = () => {
    const { translateCommit, setTranslateCommit } = useConfigStore()

    return (
        <Section title="Git & Versionamento" icon={<MdCode size={20} />} tooltip="Ajuste as preferências para a geração automática de mensagens de commit e integração Git.">
            <Row label="Tradução Automática de Commits" vertical>
                <ToggleButtonGroup value={translateCommit ? 'on' : 'off'} exclusive onChange={(_, v) => v && setTranslateCommit(v === 'on')} size="small" fullWidth>
                    <ToggleButton value="off">Inativo</ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <ToggleContent><MdTranslate size={20} /> Ativo</ToggleContent>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>
        </Section>
    )
}

export default GitConfig