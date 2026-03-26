import { Snackbar, Alert } from '@mui/material';

import { alertStyles } from './styles';

import type { NotificationSnackbarProps } from './types';

export const NotificationSnackbar = ({ message, onClose }: NotificationSnackbarProps) => (
    <Snackbar open={message.open} autoHideDuration={2000} onClose={onClose}>
        <Alert severity={message.type} variant="filled" sx={alertStyles}>{message.text}</Alert>
    </Snackbar>
);