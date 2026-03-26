import type { MessageState } from '@/sidebar/types';

export interface UseSettingsReturn {
    state: {
        msg: MessageState;
        version: string;
    };
    actions: {
        setMsg: (msg: MessageState) => void;
    };
}