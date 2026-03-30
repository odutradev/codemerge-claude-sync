import { MdAutoFixHigh, MdTerminal, MdTranslate, MdMessage } from 'react-icons/md';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';

import { GitContainer, HeaderText, IconWrapper, SectionContainer, LastSectionContainer, SectionLabel } from './styles';
import useConfigStore from '@/sidebar/stores/config';

const GitCommands = () => {
    const { translateCommit, showCommitFeedback, showExecuteFeedback, setTranslateCommit, setShowCommitFeedback, setShowExecuteFeedback } = useConfigStore();

    return (
        <GitContainer variant="outlined">
            <HeaderText variant="subtitle2">
                <IconWrapper>
                    <MdAutoFixHigh size={20} />
                </IconWrapper>
                Git & Comandos
            </HeaderText>

            <SectionContainer>
                <SectionLabel variant="caption">
                    Tradução Automática de Commits
                </SectionLabel>
                <ToggleButtonGroup
                    value={translateCommit ? 'on' : 'off'}
                    exclusive
                    onChange={(_, v) => v && setTranslateCommit(v === 'on')}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="off">
                        Inativo
                    </ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <IconWrapper>
                            <MdTranslate size={20} />
                        </IconWrapper>
                        Ativo
                    </ToggleButton>
                </ToggleButtonGroup>
            </SectionContainer>

            <SectionContainer>
                <SectionLabel variant="caption">
                    Feedback de Commit
                </SectionLabel>
                <ToggleButtonGroup
                    value={showCommitFeedback ? 'on' : 'off'}
                    exclusive
                    onChange={(_, v) => v && setShowCommitFeedback(v === 'on')}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="off">
                        Ocultar
                    </ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <IconWrapper>
                            <MdMessage size={20} />
                        </IconWrapper>
                        Exibir
                    </ToggleButton>
                </ToggleButtonGroup>
            </SectionContainer>

            <LastSectionContainer>
                <SectionLabel variant="caption">
                    Feedback de Execução
                </SectionLabel>
                <ToggleButtonGroup
                    value={showExecuteFeedback ? 'on' : 'off'}
                    exclusive
                    onChange={(_, v) => v && setShowExecuteFeedback(v === 'on')}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="off">
                        Ocultar
                    </ToggleButton>
                    <ToggleButton value="on" color="primary">
                        <IconWrapper>
                            <MdTerminal size={20} />
                        </IconWrapper>
                        Exibir
                    </ToggleButton>
                </ToggleButtonGroup>
            </LastSectionContainer>
        </GitContainer>
    );
};

export default GitCommands;