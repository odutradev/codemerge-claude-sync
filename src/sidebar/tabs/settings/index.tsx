import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';

import { Appearance } from '@/sidebar/tabs/settings/subcomponents/appearance';
import { GitCommands } from '@/sidebar/tabs/settings/subcomponents/gitCommands';
import { CodeCleanup } from '@/sidebar/tabs/settings/subcomponents/codeCleanup';
import { DataSync } from '@/sidebar/tabs/settings/subcomponents/dataSync';

import type { FetchViaBackground, MessageState } from '@/sidebar/types';

interface Props { fetchViaBackground?: FetchViaBackground; }

const SettingsView = ({ fetchViaBackground }: Props) => {
    const [msg, setMsg] = useState<MessageState>({ open: false, text: '', type: 'info' });
    const [version, setVersion] = useState('0.0.0');

    useEffect(() => { if (typeof chrome !== 'undefined' && chrome.runtime?.getManifest) setVersion(chrome.runtime.getManifest().version); }, []);

    return (
        <Box sx={{ p: 2, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Configurações</Typography>
            <Appearance />
            <GitCommands />
            <CodeCleanup />
            <DataSync setMsg={setMsg} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>CodeMerge Sync v{version}</Typography>
            <Snackbar open={msg.open} autoHideDuration={2000} onClose={() => setMsg({ ...msg, open: false })}><Alert severity={msg.type} sx={{ width: '100%' }}>{msg.text}</Alert></Snackbar>
        </Box>
    );
};

export default SettingsView;