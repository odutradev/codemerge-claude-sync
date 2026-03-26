import type { MessageState } from '@/sidebar/types';

export interface NotificationSnackbarProps {
    message: MessageState;
    onClose: () => void;
}