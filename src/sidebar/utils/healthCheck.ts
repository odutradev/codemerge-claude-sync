import type { FetchViaBackground } from '@/sidebar/types';

export const checkServerHealth = async (fetchViaBackground: FetchViaBackground, serverUrl: string): Promise<boolean> => {
    if (!serverUrl) return false;
    try {
        const res = await fetchViaBackground(`${serverUrl}/health`);
        return !!res.success;
    } catch {
        return false;
    }
};