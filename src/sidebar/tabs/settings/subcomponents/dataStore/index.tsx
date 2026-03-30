import { MdOutlinePushPin, MdLibraryAddCheck, MdPushPin, MdStorage } from 'react-icons/md'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'

import Section from '@/sidebar/tabs/settings/components/section'
import Row from '@/sidebar/tabs/settings/components/row'
import { ToggleContent } from '@/sidebar/tabs/settings/styles'
import useConfigStore from '@/sidebar/stores/config'

const DataStore = () => {
    const { persistSelection, autoSelectSynced, setPersistSelection, setAutoSelectSynced } = useConfigStore()

    return (
        <Section title="Dados & Seleção" icon={<MdStorage size={20} />} tooltip="Gerencie como os caches e seleções de arquivos locais são processados e retidos no navegador.">
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
        </Section>
    )
}

export default DataStore