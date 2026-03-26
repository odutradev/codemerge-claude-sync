import type { ReactNode } from 'react';

import { PanelContainer } from './styles';

interface Props { children: ReactNode; currentTab: number; index: number; }

export const TabPanel = ({ children, currentTab, index }: Props) => (
    <PanelContainer role="tabpanel" hidden={currentTab !== index}>
        {currentTab === index && children}
    </PanelContainer>
);