import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const IconWrapper = styled(Box)<{ customcolor?: string }>(({ customcolor }) => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', verticalAlign: 'middle', color: customcolor || 'inherit', '& svg': { width: '100%', height: '100%' } }));