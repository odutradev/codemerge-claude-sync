import { CircularProgress } from '@mui/material';

import { LoaderContainer } from './styles';

export const FallbackLoader = () => (
    <LoaderContainer>
        <CircularProgress size={32} />
    </LoaderContainer>
);
