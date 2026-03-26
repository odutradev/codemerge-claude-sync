import { MdSettings, MdBuild } from 'react-icons/md';

import { TabsContainer, StyledTabs, StyledTab, IconTab } from './styles';

export const NavigationTabs = ({ currentTab, setCurrentTab }) => (
    <TabsContainer>
        <StyledTabs value={currentTab} onChange={(_, v) => setCurrentTab(v)} variant="standard" textColor="primary" indicatorColor="primary">
            <StyledTab label="Sync" />
            <StyledTab label="Artefatos" />
            <IconTab icon={<MdBuild size={20} />} />
            <IconTab icon={<MdSettings size={20} />} />
        </StyledTabs>
    </TabsContainer>
);