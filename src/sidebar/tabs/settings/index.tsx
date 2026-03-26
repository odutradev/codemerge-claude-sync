import { Box, Typography } from '@mui/material';

import { Appearance } from '@/sidebar/tabs/settings/subcomponents/appearance';
import { GitCommands } from '@/sidebar/tabs/settings/subcomponents/gitCommands';
import { CodeCleanup } from '@/sidebar/tabs/settings/subcomponents/codeCleanup';
import { DataSync } from '@/sidebar/tabs/settings/subcomponents/dataSync';
import { containerStyles, versionTextStyles } from './styles';
import { useSettings } from '@/sidebar/tabs/settings/hooks';

import type { FetchViaBackground } from '@/sidebar/types';

interface Props { fetchViaBackground?: FetchViaBackground; }

const SettingsView = ({ fetchViaBackground }: Props) => {
    const { state } = useSettings();

    return (
        <Box sx={containerStyles}>
            <Typography variant="h6" sx={{ mb: 3 }}>Configurações</Typography>
            <Appearance />
            <GitCommands />
            <CodeCleanup />
            <DataSync />
            <Typography variant="caption" sx={versionTextStyles}>CodeMerge Sync v{state.version}</Typography>
        </Box>
    );
};

export default SettingsView;