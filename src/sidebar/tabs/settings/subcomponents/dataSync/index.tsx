import { MdOutlinePushPin, MdLibraryAddCheck, MdPushPin, MdTimer, MdLink, MdSync } from 'react-icons/md'
import { ToggleButtonGroup, InputAdornment, ToggleButton, TextField } from '@mui/material'

import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import useConfigStore from '@/sidebar/stores/config'
import { ToggleContent } from '@/sidebar/tabs/settings/styles'

const DataSync = () => {
    const { serverUrl, checkInterval, persistSelection, autoSelectSynced, setServerUrl, setCheckInterval, setPersistSelection, setAutoSelectSynced } = useConfigStore()

    return (
        <Section title="Dados & Sincronização" icon={<MdSync size={20} />}>
            <Row label="URL do Servidor" vertical>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdLink size={20} />
                            </InputAdornment>
                        )
                    }}
                />
            </Row>

            <Row label="Persistência" vertical>
                <ToggleButtonGroup value={persistSelection ? 'on' : 'off'} exclusive onChange={(_, v) => v && setPersistSelection(v === 'on')} size="small" fullWidth>
                    <ToggleButton value="off">
                        <ToggleContent><MdOutlinePushPin size={20} /> Volátil</ToggleContent>
                    </ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <ToggleContent><MdPushPin size={20} /> Manter Seleção</ToggleContent>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>

            <Row label="Auto-selecionar Artefatos" vertical>
                <ToggleButtonGroup value={autoSelectSynced ? 'on' : 'off'} exclusive onChange={(_, v) => v && setAutoSelectSynced(v === 'on')} size="small" fullWidth>
                    <ToggleButton value="off">Inativo</ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <ToggleContent><MdLibraryAddCheck size={20} /> Ativo</ToggleContent>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Row>

            <Row label="Intervalo de Checagem (ms)" vertical>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="number"
                    value={checkInterval}
                    onChange={(e) => setCheckInterval(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MdTimer size={20} />
                            </InputAdornment>
                        )
                    }}
                />
            </Row>
        </Section>
    )
}

export default DataSync