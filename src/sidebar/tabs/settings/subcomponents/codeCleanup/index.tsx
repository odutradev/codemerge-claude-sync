import { ToggleButtonGroup, FormControlLabel, ToggleButton, Typography, Checkbox } from '@mui/material';
import { MdAutoFixHigh } from 'react-icons/md';

import { CleanupContainer, HeaderText, IconWrapper, ToggleContainer, OptionsContainer } from './styles';
import useConfigStore from '@/sidebar/stores/config';

const CodeCleanup = () => {
    const { removeComments, removeEmptyLines, removeLogs, setRemoveComments, setRemoveEmptyLines, setRemoveLogs } = useConfigStore();

    return (
        <CleanupContainer variant="outlined">
            <HeaderText variant="subtitle2">
                <IconWrapper>
                    <MdAutoFixHigh size={20} />
                </IconWrapper>
                Limpeza de Código
            </HeaderText>

            <ToggleContainer>
                <ToggleButtonGroup
                    value={removeComments ? 'on' : 'off'}
                    exclusive
                    onChange={(_, v) => v && setRemoveComments(v === 'on')}
                    size="small"
                    fullWidth
                >
                    <ToggleButton value="off">
                        Não Limpar
                    </ToggleButton>
                    <ToggleButton value="on" color="primary">
                        Limpar
                    </ToggleButton>
                </ToggleButtonGroup>
            </ToggleContainer>

            <OptionsContainer isActive={removeComments}>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked
                            disabled
                        />
                    }
                    label={
                        <Typography variant="caption">
                            Remover Comentários (Base)
                        </Typography>
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={removeEmptyLines}
                            onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                        />
                    }
                    label={
                        <Typography variant="caption">
                            Remover Linhas Vazias
                        </Typography>
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={removeLogs}
                            onChange={(e) => setRemoveLogs(e.target.checked)}
                        />
                    }
                    label={
                        <Typography variant="caption">
                            Remover Console Logs
                        </Typography>
                    }
                />
            </OptionsContainer>
        </CleanupContainer>
    );
};

export default CodeCleanup;