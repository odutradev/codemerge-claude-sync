import { useState, useEffect } from 'react';

import type { UseSettingsReturn } from './types';

export const useSettings = (): UseSettingsReturn => {
    const [version, setVersion] = useState('0.0.0');

    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.runtime?.getManifest) {
            setVersion(chrome.runtime.getManifest().version);
        }
    }, []);

    return { state: { version }, actions: {} };
};