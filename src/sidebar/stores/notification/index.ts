import { create } from 'zustand';

import { DEFAULT_NOTIFICATION_STATE } from './defaultValues';
import useConfigStore from '@/sidebar/stores/config';

import type { NotificationState, NotificationActions } from './types';

const useNotificationStore = create<NotificationState & NotificationActions>()((set) => ({
    ...DEFAULT_NOTIFICATION_STATE,
    showNotification: (text, type = 'info') => {
        const { verbosity } = useConfigStore.getState();
        if (verbosity === 'silent' || (verbosity === 'errors' && type !== 'error')) return;
        set({ message: { open: true, text, type } });
    },
    hideNotification: () => set((state) => ({ message: { ...state.message, open: false } }))
}));

export default useNotificationStore;