import { MdSettingsBrightness, MdLightMode, MdDarkMode, MdViewHeadline, MdViewCompact, MdNotifications, MdErrorOutline, MdNotificationsOff, MdColorLens } from 'react-icons/md';
import { ToggleButtonGroup, ToggleButton, Box } from '@mui/material';
import { useRef } from 'react';

import { AppearanceContainer, HeaderText, SectionContainer, SectionLabel, IconWrapper, ColorListContainer, ColorOption, PickerContainer, PickerButton, ColorIconWrapper, HiddenInput } from './styles';
import useConfigStore from '@/sidebar/stores/config';

const PREDEFINED_COLORS = ['#da7756', '#2196f3', '#4caf50', '#9c27b0', '#f44336'];

const Appearance = () => {
    const { themeMode, primaryColor, compactMode, verbosity, setThemeMode, setPrimaryColor, setCompactMode, setVerbosity } = useConfigStore();
    const colorRef = useRef<HTMLInputElement>(null);

    return (
        <AppearanceContainer variant="outlined">
            <HeaderText variant="subtitle2">
                Interface & UX
            </HeaderText>

            <SectionContainer>
                <SectionLabel variant="caption">
                    Aparência
                </SectionLabel>
                <ToggleButtonGroup
                    value={themeMode}
                    exclusive
                    onChange={(_, v) => v && setThemeMode(v)}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="light">
                        <IconWrapper>
                            <MdLightMode size={20} />
                        </IconWrapper>
                        Claro
                    </ToggleButton>
                    <ToggleButton value="system">
                        <IconWrapper>
                            <MdSettingsBrightness size={20} />
                        </IconWrapper>
                        Auto
                    </ToggleButton>
                    <ToggleButton value="dark">
                        <IconWrapper>
                            <MdDarkMode size={20} />
                        </IconWrapper>
                        Escuro
                    </ToggleButton>
                </ToggleButtonGroup>
            </SectionContainer>

            <SectionContainer>
                <SectionLabel variant="caption">
                    Densidade
                </SectionLabel>
                <ToggleButtonGroup
                    value={compactMode ? 'compact' : 'normal'}
                    exclusive
                    onChange={(_, v) => v && setCompactMode(v === 'compact')}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="normal">
                        <IconWrapper>
                            <MdViewHeadline size={20} />
                        </IconWrapper>
                        Normal
                    </ToggleButton>
                    <ToggleButton value="compact">
                        <IconWrapper>
                            <MdViewCompact size={20} />
                        </IconWrapper>
                        Compacto
                    </ToggleButton>
                </ToggleButtonGroup>
            </SectionContainer>

            <SectionContainer>
                <SectionLabel variant="caption">
                    Notificações
                </SectionLabel>
                <ToggleButtonGroup
                    value={verbosity}
                    exclusive
                    onChange={(_, v) => v && setVerbosity(v)}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="all">
                        <IconWrapper>
                            <MdNotifications size={20} />
                        </IconWrapper>
                        Tudo
                    </ToggleButton>
                    <ToggleButton value="errors">
                        <IconWrapper>
                            <MdErrorOutline size={20} />
                        </IconWrapper>
                        Erros
                    </ToggleButton>
                    <ToggleButton value="silent">
                        <IconWrapper>
                            <MdNotificationsOff size={20} />
                        </IconWrapper>
                        Mudo
                    </ToggleButton>
                </ToggleButtonGroup>
            </SectionContainer>

            <Box>
                <SectionLabel variant="caption">
                    Cor Principal
                </SectionLabel>
                <ColorListContainer>
                    {PREDEFINED_COLORS.map(c => (
                        <ColorOption
                            key={c}
                            colorValue={c}
                            isSelected={primaryColor === c}
                            onClick={() => setPrimaryColor(c)}
                        />
                    ))}
                    <PickerContainer>
                        <PickerButton onClick={() => colorRef.current?.click()}>
                            <ColorIconWrapper customColor={primaryColor}>
                                <MdColorLens size={20} />
                            </ColorIconWrapper>
                        </PickerButton>
                        <HiddenInput
                            ref={colorRef}
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                    </PickerContainer>
                </ColorListContainer>
            </Box>
        </AppearanceContainer>
    );
};

export default Appearance;