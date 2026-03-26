import type { ServerStatus } from '@/sidebar/types';

export interface UseServerStatusReturn {
    serverStatus: ServerStatus;
    isChecking: boolean;
}