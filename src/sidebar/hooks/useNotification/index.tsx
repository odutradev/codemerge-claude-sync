import { createContext, useContext, useState, useCallback } from 'react';

import useConfigStore from '@/sidebar/stores/config';

import type { NotificationContextData, NotificationProviderProps } from './types';
import type { MessageState } from '@/sidebar/types';

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const { verbosity } = useConfigStore();
    const [message, setMessage] = useState<MessageState>({ open: false, text: '', type: 'info' });

    const showNotification = useCallback((text: string, type: MessageState['type'] = 'info') => {
        if (verbosity === 'silent' || (verbosity === 'errors' && type !== 'error')) return;
        setMessage({ open: true, text, type });
    }, [verbosity]);

    const hideNotification = useCallback(() => setMessage((prev) => ({ ...prev, open: false })), []);

    return (
        <NotificationContext.Provider value={{ message, showNotification, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextData => useContext(NotificationContext);