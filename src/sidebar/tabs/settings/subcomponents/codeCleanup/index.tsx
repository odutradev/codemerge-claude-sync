import { MdAutoFixHigh } from 'react-icons/md';
import { ToggleButtonGroup, FormControlLabel, ToggleButton, Typography, Checkbox, Paper, Box } from '@mui/material';

import useConfigStore from '@/sidebar/store/configStore';

export const CodeCleanup = () => {
    const { removeComments, removeEmptyLines, removeLogs, setRemoveComments, setRemoveEmptyLines, setRemoveLogs } = useConfigStore();

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}><MdAutoFixHigh size={20} style={{ marginRight: 8 }} /> Limpeza de Código</Typography>
            <Box sx={{ mb: 2 }}><ToggleButtonGroup value={removeComments ? 'on' : 'off'} exclusive onChange={(_, v) => v && setRemoveComments(v === 'on')} size="small" fullWidth><ToggleButton value="off">Não Limpar</ToggleButton><ToggleButton value="on" color="primary">Limpar</ToggleButton></ToggleButtonGroup></Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, opacity: removeComments ? 1 : 0.5, pointerEvents: removeComments ? 'auto' : 'none' }}>
                <FormControlLabel control={<Checkbox size="small" checked disabled />} label={<Typography variant="caption">Remover Comentários (Base)</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={removeEmptyLines} onChange={(e) => setRemoveEmptyLines(e.target.checked)} />} label={<Typography variant="caption">Remover Linhas Vazias</Typography>} />
                <FormControlLabel control={<Checkbox size="small" checked={removeLogs} onChange={(e) => setRemoveLogs(e.target.checked)} />} label={<Typography variant="caption">Remover Console Logs</Typography>} />
            </Box>
        </Paper>
    );
};