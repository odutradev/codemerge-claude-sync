import { Snackbar, Alert } from '@mui/material';

import { useNotification } from '@/sidebar/hooks/useNotification';
import { alertStyles } from './styles';

import type { NotificationSnackbarProps } from './types';

export const NotificationSnackbar = ({}: NotificationSnackbarProps) => {
    const { message, hideNotification } = useNotification();

    return (
        <Snackbar open={message.open} autoHideDuration={2000} onClose={hideNotification}>
            <Alert severity={message.type} variant="filled" sx={alertStyles}>{message.text}</Alert>
        </Snackbar>
    );
};
