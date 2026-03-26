import type { ReactNode } from 'react';

import type { MessageState } from '@/sidebar/types';

export interface NotificationContextData {
    message: MessageState;
    showNotification: (text: string, type?: MessageState['type']) => void;
    hideNotification: () => void;
}

export interface NotificationProviderProps {
    children: ReactNode;
}