import { MdTerminal, MdTranslate, MdMessage, MdCode } from 'react-icons/md'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import useConfigStore from '@/sidebar/stores/config'
import { ToggleContent } from '@/sidebar/tabs/settings/styles'

const GitCommands = () => {
    const { translateCommit, showCommitFeedback, showExecuteFeedback, setTranslateCommit, setShowCommitFeedback, setShowExecuteFeedback } = useConfigStore()

    return (
        <Section title="Git & Comandos" icon={<MdCode size={20} />}>
            <Row label="Tradução Automática de Commits" vertical>
                <ToggleButtonGroup value={translateCommit ? 'on' : 'off'} exclusive onChange={(_, v) => v && setTranslateCommit(v === 'on')} size="small" fullWidth>
                    <ToggleButton value="off">Inativo</ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <ToggleContent><MdTranslate size={20} /> Ativo</ToggleContent>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>

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

export default GitCommands