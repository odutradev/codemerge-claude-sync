import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Paper,
    CircularProgress,
    Chip,
    Snackbar,
    Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CodeIcon from '@mui/icons-material/Code';

const ArtifactsView = ({ config, fetchViaBackground }) => {
    const [artifacts, setArtifacts] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ open: false, text: '', type: 'info' });

    const handleFetchArtifacts = async () => {
        setLoading(true);
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const activeTab = tabs[0];
            
            if (!activeTab || !activeTab.url.includes('gemini.google.com')) {
                throw new Error('Esta função só funciona no Gemini');
            }

            const response = await chrome.tabs.sendMessage(activeTab.id, {
                type: 'GET_GEMINI_ARTIFACTS'
            });

            if (!response.success) throw new Error(response.error);
            
            setArtifacts(response.artifacts || []);
            // Select all by default
            setSelectedIndices(new Set((response.artifacts || []).map((_, i) => i)));
            setMessage({ open: true, text: `${response.artifacts?.length || 0} artefatos encontrados`, type: 'success' });

        } catch (error) {
            setMessage({ open: true, text: `Erro: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (index) => {
        const newSelected = new Set(selectedIndices);
        if (newSelected.has(index)) newSelected.delete(index);
        else newSelected.add(index);
        setSelectedIndices(newSelected);
    };

    const handleSync = async () => {
        if (selectedIndices.size === 0) return;
        setLoading(true);
        try {
            const selectedFiles = Array.from(selectedIndices).map(index => {
                const artifact = artifacts[index];
                return {
                    path: artifact.name,
                    content: artifact.code
                };
            });

            const response = await fetchViaBackground(
                `${config.serverUrl}/upsert`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ files: selectedFiles })
                }
            );

            if (!response.success) throw new Error(response.error);

            setMessage({ open: true, text: 'Artefatos enviados com sucesso!', type: 'success' });
        } catch (error) {
            setMessage({ open: true, text: `Erro: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
            <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />} 
                onClick={handleFetchArtifacts}
                disabled={loading}
                fullWidth
                sx={{ mb: 2 }}
            >
                Buscar Artefatos (Gemini)
            </Button>

            {artifacts.length > 0 ? (
                <>
                    <Paper variant="outlined" sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                        <List dense>
                            {artifacts.map((artifact, index) => (
                                <ListItem 
                                    key={index}
                                    button 
                                    onClick={() => handleToggle(index)}
                                    divider
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedIndices.has(index)}
                                            tabIndex={-1}
                                            disableRipple
                                            size="small"
                                        />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                                                    {artifact.name}
                                                </Typography>
                                                <Chip label={artifact.language} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.6rem' }} />
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {artifact.code.length} chars • {artifact.code.split('\n').length} lines
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
                        onClick={handleSync}
                        disabled={loading || selectedIndices.size === 0}
                        fullWidth
                    >
                        Fazer Upsert Local ({selectedIndices.size})
                    </Button>
                </>
            ) : (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                    <Typography variant="body2">Nenhum artefato carregado</Typography>
                </Box>
            )}

            <Snackbar 
                open={message.open} 
                autoHideDuration={4000} 
                onClose={() => setMessage({ ...message, open: false })}
            >
                <Alert severity={message.type} sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ArtifactsView;