import { useState, useEffect } from 'react';

import type { MessageState } from '@/sidebar/types';
import type { UseSettingsReturn } from './types';

export const useSettings = (): UseSettingsReturn => {
    const [msg, setMsg] = useState<MessageState>({ open: false, text: '', type: 'info' });
    const [version, setVersion] = useState('0.0.0');

    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.runtime?.getManifest) {
            setVersion(chrome.runtime.getManifest().version);
        }
    }, []);

    return { state: { msg, version }, actions: { setMsg } };
};