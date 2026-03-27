import { Snackbar } from '@mui/material'

import useNotificationStore from '@/sidebar/stores/notification'
import { StyledAlert } from './styles'

import type { NotificationSnackbarProps } from './types'

export const NotificationSnackbar = ({}: NotificationSnackbarProps) => {
    const { message, hideNotification } = useNotificationStore()

    return (
        <Snackbar open={message.open} autoHideDuration={2000} onClose={hideNotification}>
            <StyledAlert severity={message.type} variant="filled">
                {message.text}
            </StyledAlert>
        </Snackbar>
    )
}