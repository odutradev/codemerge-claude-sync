import { MdSettings, MdBuild } from 'react-icons/md';
import { Tabs } from '@mui/material';

import { TabsContainer, StyledTab, IconTab } from './styles';

export const NavigationTabs = ({ currentTab, setCurrentTab }) => (
    <TabsContainer>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)} variant="standard" textColor="primary" indicatorColor="primary" sx={{ '& .MuiTabs-flexContainer': { display: 'flex' } }}>
            <StyledTab label="Sync" />
            <StyledTab label="Artefatos" />
            <IconTab icon={<MdBuild size={20} />} />
            <IconTab icon={<MdSettings size={20} />} />
        </Tabs>
    </TabsContainer>
);
