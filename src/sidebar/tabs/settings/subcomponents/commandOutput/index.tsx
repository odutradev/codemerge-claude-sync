import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import { MdTerminal, MdMessage } from 'react-icons/md'

import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import { ToggleContent } from '@/sidebar/tabs/settings/styles'
import useConfigStore from '@/sidebar/stores/config'

const CommandOutput = () => {
    const { showCommitFeedback, showExecuteFeedback, setShowCommitFeedback, setShowExecuteFeedback } = useConfigStore()

    return (
        <Section title="Feedback de Comandos" icon={<MdTerminal size={20} />} tooltip="Controle a exibição de logs e retornos no painel ao executar operações do terminal.">
            <Row label="Feedback de Commit" vertical>
                <ToggleButtonGroup value={showCommitFeedback ? 'on' : 'off'} exclusive onChange={(_, v) => v && setShowCommitFeedback(v === 'on')} size="small" fullWidth>
                    <ToggleButton value="off">Ocultar</ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <ToggleContent><MdMessage size={20} /> Exibir</ToggleContent>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>

            <Row label="Feedback de Execução" vertical>
                <ToggleButtonGroup value={showExecuteFeedback ? 'on' : 'off'} exclusive onChange={(_, v) => v && setShowExecuteFeedback(v === 'on')} size="small" fullWidth>
                    <ToggleButton value="off">Ocultar</ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <ToggleContent><MdTerminal size={20} /> Exibir</ToggleContent>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>
        </Section>
    )
}

export default CommandOutput