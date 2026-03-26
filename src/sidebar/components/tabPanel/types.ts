import type { ReactNode } from 'react';

export interface TabPanelProps {
    children: ReactNode;
    currentTab: number;
    index: number;
}