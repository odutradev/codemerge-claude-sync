import { Box, Typography } from '@mui/material';

import { getStatusProps, containerStyles, indicatorStyles, textStyles } from './styles';

import type { ServerStatusIndicatorProps } from './types';

export const ServerStatusIndicator = ({ status, isChecking, showText = true }: ServerStatusIndicatorProps) => {
    const props = getStatusProps(status, isChecking);
    return (
        <Box sx={containerStyles}>
            <Box sx={indicatorStyles(props.color, props.animation, props.borderColor)} />
            {showText && <Typography variant="caption" sx={textStyles}>{props.text}</Typography>}
        </Box>
    );
};