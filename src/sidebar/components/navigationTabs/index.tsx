import { MdSettings, MdBuild } from 'react-icons/md';

import { TabsContainer, StyledTabs, StyledTab, IconTab } from './styles';

interface Props { currentTab: number; setCurrentTab: (val: number) => void; }

export const NavigationTabs = ({ currentTab, setCurrentTab }: Props) => (
    <TabsContainer>
        <StyledTabs value={currentTab} onChange={(_, v) => setCurrentTab(v)} variant="standard" textColor="primary" indicatorColor="primary">
            <StyledTab label="Sync" />
            <StyledTab label="Artefatos" />
            <IconTab icon={<MdBuild size={20} />} />
            <IconTab icon={<MdSettings size={20} />} />
        </StyledTabs>
    </TabsContainer>
);