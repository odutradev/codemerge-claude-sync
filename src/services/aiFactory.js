import { geminiService } from '@/services/geminiService';
import { claudeService } from '@/services/claudeService';

export const getAiService = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('claude.ai')) return claudeService;
    if (hostname.includes('gemini.google.com')) return geminiService;
    throw new Error('UnsupportedPlatform');
};