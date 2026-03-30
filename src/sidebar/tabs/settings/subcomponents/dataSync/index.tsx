import { TextField, InputAdornment } from '@mui/material'
import { MdTimer, MdLink, MdSync } from 'react-icons/md'

import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import useConfigStore from '@/sidebar/stores/config'

const DataSync = () => {
    const { serverUrl, checkInterval, setServerUrl, setCheckInterval } = useConfigStore()

    return (
        <Section title="Servidor de Sincronização" icon={<MdSync size={20} />} tooltip="Configurações de conexão e intervalo de ping com o servidor local (codemerge-cli).">
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