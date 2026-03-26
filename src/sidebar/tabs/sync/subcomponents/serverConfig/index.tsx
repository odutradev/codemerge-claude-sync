import { Box, Typography, TextField, InputAdornment, Button, CircularProgress } from '@mui/material';
import { MdRefresh } from 'react-icons/md';
import { keyframes } from '@mui/material/styles';

interface Props { serverUrl: string; setServerUrl: (u: string) => void; handleFetchStructure: () => void; loading: boolean; isChecking: boolean; serverStatus: string; }

const pulseGreen = keyframes`0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); } 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }`;
const pulseRed = keyframes`0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0); } 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }`;
const pulseOrange = keyframes`0% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(237, 108, 2, 0); } 100% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0); }`;

export const ServerConfig = ({ serverUrl, setServerUrl, handleFetchStructure, loading, isChecking, serverStatus }: Props) => {
    const statusProps = { connected: { color: 'success.main', borderColor: '#4caf50', borderAnimation: `${pulseGreen} 3s infinite` }, disconnected: { color: 'error.main', borderColor: '#f44336', borderAnimation: `${pulseRed} 2s infinite` }, checking: { color: 'warning.main', borderColor: '#ed6c02', borderAnimation: `${pulseOrange} 1.5s infinite` } }[isChecking ? 'checking' : serverStatus] || { color: 'text.disabled', borderColor: 'transparent', borderAnimation: 'none' };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">URL do Servidor</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField fullWidth size="small" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} InputProps={{ endAdornment: <InputAdornment position="end"><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: statusProps.color }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { animation: statusProps.borderAnimation, '& fieldset': { borderColor: statusProps.borderColor } } }} />
                <Button variant="outlined" onClick={handleFetchStructure} disabled={loading || isChecking || serverStatus !== 'connected'} sx={{ minWidth: 'auto', px: 2 }}>{loading ? <CircularProgress size={20} /> : <MdRefresh size={20} />}</Button>
            </Box>
        </Box>
    );
};