import { create } from 'zustand';

import useConfigStore from '@/sidebar/stores/config';

import type { NotificationState, NotificationActions } from './types';
import type { MessageState } from '@/sidebar/types';

const useNotificationStore = create<NotificationState & NotificationActions>()((set) => ({
    message: { open: false, text: '', type: 'info' },
    showNotification: (text: string, type: MessageState['type'] = 'info') => {
        const { verbosity } = useConfigStore.getState();
        if (verbosity === 'silent' || (verbosity === 'errors' && type !== 'error')) return;
        set({ message: { open: true, text, type } });
    },
    hideNotification: () => set((state) => ({ message: { ...state.message, open: false } }))
}));

export default useNotificationStore;