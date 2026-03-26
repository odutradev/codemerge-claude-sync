import { keyframes } from '@mui/material/styles';
import type { HookStatus } from '@/sidebar/types';

const pulseGreen = keyframes`0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); } 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }`;
const pulseRed = keyframes`0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(244, 67, 54, 0); } 100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }`;
const pulseOrange = keyframes`0% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(237, 108, 2, 0); } 100% { box-shadow: 0 0 0 0 rgba(237, 108, 2, 0); }`;

export const getStatusProps = (status: string, isChecking: boolean) => {
    const activeStatus = isChecking ? 'checking' : status;
    const propsMap: Record<string, { color: string; animation: string; text: string }> = { connected: { color: 'success.main', animation: `${pulseGreen} 3s infinite`, text: 'Online' }, disconnected: { color: 'error.main', animation: `${pulseRed} 2s infinite`, text: 'Offline' }, checking: { color: 'warning.main', animation: `${pulseOrange} 1.5s infinite`, text: 'Verificando...' } };
    return propsMap[activeStatus] ?? { color: 'text.disabled', animation: 'none', text: '...' };
};
export const containerStyles = { display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 };
export const actionsContainerStyles = { display: 'flex', gap: 1, mb: 2 };
export const historyBoxStyles = { display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 0.5, height: 36, flexShrink: 0 };
export const iconButtonStyles = (isActive: boolean, hookStatus: HookStatus = 'idle') => {
    const isSuccess = hookStatus === 'success'; const isError = hookStatus === 'error';
    return { border: '1px solid', borderColor: isSuccess ? 'success.main' : isError ? 'error.main' : isActive ? 'primary.main' : 'divider', borderRadius: 2, width: 36, height: 36, flexShrink: 0, animation: isSuccess ? `${pulseGreen} 1s infinite` : isError ? `${pulseRed} 1s infinite` : 'none', color: isSuccess ? 'success.main' : isError ? 'error.main' : 'inherit', transition: 'all 0.3s ease' };
};