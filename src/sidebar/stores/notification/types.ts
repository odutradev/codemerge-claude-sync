import type { MessageState } from '@/sidebar/types';

export interface NotificationState {
    message: MessageState;
}

export interface NotificationActions {
    showNotification: (text: string, type?: MessageState['type']) => void;
    hideNotification: () => void;
}