import { useState, useEffect } from 'react';

import { checkServerHealth } from '@/sidebar/utils/healthCheck';

import type { UseServerStatusReturn } from './types';
import type { FetchViaBackground } from '@/sidebar/types';

export const useServerStatus = (serverUrl: string, checkInterval: number, fetchViaBackground: FetchViaBackground): UseServerStatusReturn => {
    const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const checkHealth = async () => {
            if (!serverUrl) return;
            if (isMounted) setIsChecking(true);
            const isHealthy = await checkServerHealth(fetchViaBackground, serverUrl);
            if (isMounted) {
                setServerStatus(isHealthy ? 'connected' : 'disconnected');
                setTimeout(() => { if (isMounted) setIsChecking(false); }, 500);
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, checkInterval);
        return () => { isMounted = false; clearInterval(interval); };
    }, [serverUrl, checkInterval, fetchViaBackground]);

    return { serverStatus, isChecking };
};