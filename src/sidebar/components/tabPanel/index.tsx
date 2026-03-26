import { PanelContainer } from './styles';
import type { TabPanelProps } from './types';

export const TabPanel = ({ children, currentTab, index }: TabPanelProps) => (
    <PanelContainer role="tabpanel" hidden={currentTab !== index}>
        {currentTab === index && children}
    </PanelContainer>
);