import { Box, Typography, TextField, InputAdornment, Button, CircularProgress } from '@mui/material';
import { MdRefresh } from 'react-icons/md';

import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator';
import { getStatusProps } from '@/sidebar/components/serverStatusIndicator/styles';
import { boxStyles, inputStyles } from './styles';

import type { ServerConfigProps } from './types';

export const ServerConfig = ({ serverUrl, setServerUrl, handleFetchStructure, loading, isChecking, serverStatus }: ServerConfigProps) => {
    const props = getStatusProps(serverStatus, isChecking);

    return (
        <Box sx={boxStyles}>
            <Typography variant="caption" color="text.secondary">URL do Servidor</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField fullWidth size="small" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} InputProps={{ endAdornment: <InputAdornment position="end"><ServerStatusIndicator status={serverStatus} isChecking={isChecking} showText={false} /></InputAdornment> }} sx={inputStyles(props.animation, props.borderColor)} />
                <Button variant="outlined" onClick={handleFetchStructure} disabled={loading || isChecking || serverStatus !== 'connected'} sx={{ minWidth: 'auto', px: 2 }}>{loading ? <CircularProgress size={20} /> : <MdRefresh size={20} />}</Button>
            </Box>
        </Box>
    );
};