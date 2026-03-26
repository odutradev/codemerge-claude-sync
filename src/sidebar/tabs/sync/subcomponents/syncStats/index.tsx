import { Box, Typography, Button, Paper, Tooltip } from '@mui/material';
import { MdFormatAlignLeft, MdInsertDriveFile, MdCloudUpload, MdAccessTime, MdStar } from 'react-icons/md';

interface Props { stats: { files: number; lines: number; lastUpdate: string }; pinnedCount: number; handleSync: () => void; loading: boolean; serverStatus: string; hasSelection: boolean; }

export const SyncStats = ({ stats, pinnedCount, handleSync, loading, serverStatus, hasSelection }: Props) => (
    <>
        <Paper variant="outlined" sx={{ p: 1, mb: 2, bgcolor: 'background.paper', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Arquivos selecionados"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box component={MdInsertDriveFile} sx={{ fontSize: 16, color: 'text.secondary' }} /><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{stats.files}</Typography></Box></Tooltip>
                    <Tooltip title="Total de linhas"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box component={MdFormatAlignLeft} sx={{ fontSize: 16, color: 'text.secondary' }} /><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{stats.lines}</Typography></Box></Tooltip>
                    <Tooltip title="Favoritos"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box component={MdStar} sx={{ fontSize: 16, color: 'text.secondary' }} /><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{pinnedCount}</Typography></Box></Tooltip>
                </Box>
                <Tooltip title="Última atualização"><Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Box component={MdAccessTime} sx={{ fontSize: 16, color: 'text.secondary' }} /><Typography variant="caption" color="text.secondary">{stats.lastUpdate}</Typography></Box></Tooltip>
            </Box>
        </Paper>
        <Button variant="contained" onClick={handleSync} disabled={loading || !hasSelection || serverStatus !== 'connected'} fullWidth startIcon={<MdCloudUpload size={20} />}>Sincronizar Selecionados</Button>
    </>
);