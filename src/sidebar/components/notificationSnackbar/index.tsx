import { Snackbar, Alert } from '@mui/material';

import useNotificationStore from '@/sidebar/stores/notification';
import { alertStyles } from './styles';

import type { NotificationSnackbarProps } from './types';

export const NotificationSnackbar = ({}: NotificationSnackbarProps) => {
    const { message, hideNotification } = useNotificationStore();

    return (
        <Snackbar open={message.open} autoHideDuration={2000} onClose={hideNotification}>
            <Alert severity={message.type} variant="filled" sx={alertStyles}>{message.text}</Alert>
        </Snackbar>
    );
};