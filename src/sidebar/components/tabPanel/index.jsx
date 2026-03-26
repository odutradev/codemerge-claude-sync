import { PanelContainer } from './styles';

export const TabPanel = ({ children, currentTab, index }) => (
    <PanelContainer role="tabpanel" hidden={currentTab !== index}>
        {currentTab === index && children}
    </PanelContainer>
);
