import { CircularProgress } from '@mui/material';

import { LoaderContainer } from './styles';
import type { FallbackLoaderProps } from './types';

export const FallbackLoader = ({}: FallbackLoaderProps) => (
    <LoaderContainer>
        <CircularProgress size={32} />
    </LoaderContainer>
);