import { Box, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": { display: "flex" },
});

export const StyledTab = styled(Tab)({
  flexGrow: 1,
  flexBasis: 0,
  maxWidth: "none",
});

export const IconTab = styled(Tab)({ 
    minWidth: 48,
    width: 48, 
    padding: 0
});
