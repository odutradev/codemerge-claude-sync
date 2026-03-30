import { ToggleButtonGroup, FormControlLabel, ToggleButton, Typography, Checkbox } from '@mui/material'
import { MdAutoFixHigh } from 'react-icons/md'

import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import useConfigStore from '@/sidebar/stores/config'
import { OptionsContainer } from './styles'

const CodeCleanup = () => {
    const { removeComments, removeEmptyLines, removeLogs, setRemoveComments, setRemoveEmptyLines, setRemoveLogs } = useConfigStore()

    return (
        <Section title="Limpeza de Código" icon={<MdAutoFixHigh size={20} />} tooltip="Remova códigos mortos, comentários e logs antes de enviar os artefatos para processamento.">
            <Row vertical>
                <ToggleButtonGroup value={removeComments ? 'on' : 'off'} exclusive onChange={(_, v) => v && setRemoveComments(v === 'on')} size="small" fullWidth>
                    <ToggleButton value="off">Não Limpar</ToggleButton>
                    <ToggleButton value="on" color="primary">Limpar</ToggleButton>
                </ToggleButtonGroup>
            </Row>

            <OptionsContainer $isActive={removeComments}>
                <FormControlLabel
                    control={<Checkbox size="small" checked disabled />}
                    label={<Typography variant="caption">Remover Comentários (Base)</Typography>}
                />
                <FormControlLabel
                    control={<Checkbox size="small" checked={removeEmptyLines} onChange={(e) => setRemoveEmptyLines(e.target.checked)} />}
                    label={<Typography variant="caption">Remover Linhas Vazias</Typography>}
                />
                <FormControlLabel
                    control={<Checkbox size="small" checked={removeLogs} onChange={(e) => setRemoveLogs(e.target.checked)} />}
                    label={<Typography variant="caption">Remover Console Logs</Typography>}
                />
            </OptionsContainer>
        </Section>
    )
}

export default CodeCleanup