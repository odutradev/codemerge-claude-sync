import { IconButton, Tooltip } from '@mui/material';
import { MdTranslate, MdRestore } from 'react-icons/md';
import { VscGitCommit } from 'react-icons/vsc';

import { CommitPaper, HeaderBox, TitleTypography, ActionBox, StyledSelect, StyledMenuItem, StyledTextField, StyledButton } from './styles';

interface Props { commitType: string; setCommitType: (v: string) => void; translateCommit: boolean; setTranslateCommit: (v: boolean) => void; commitMessage: string; setCommitMessage: (v: string) => void; originalCommitMessage: string; originalCommitType: string; handleCommit: () => void; actionLoading: boolean; serverStatus: string; }

const COMMIT_TYPES = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];

export const CommitBox = ({ commitType, setCommitType, translateCommit, setTranslateCommit, commitMessage, setCommitMessage, originalCommitMessage, originalCommitType, handleCommit, actionLoading, serverStatus }: Props) => (
    <CommitPaper variant="outlined">
        <HeaderBox>
            <TitleTypography variant="caption">MENSAGEM DE COMMIT</TitleTypography>
            <ActionBox>
                <StyledSelect size="small" value={commitType} onChange={(e) => setCommitType(e.target.value as string)} disabled={actionLoading}>
                    {COMMIT_TYPES.map(type => <StyledMenuItem key={type} value={type}>{type}</StyledMenuItem>)}
                </StyledSelect>
                <Tooltip title={translateCommit ? 'Tradução Automática: Ativada' : 'Tradução Automática: Desativada'}>
                    <IconButton size="small" onClick={() => setTranslateCommit(!translateCommit)} color={translateCommit ? 'primary' : 'default'} disabled={actionLoading}>
                        <MdTranslate size={20} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Restaurar Mensagem Original">
                    <IconButton size="small" onClick={() => { setCommitMessage(originalCommitMessage); setCommitType(originalCommitType); }} disabled={(commitMessage === originalCommitMessage && commitType === originalCommitType) || actionLoading || !originalCommitMessage}>
                        <MdRestore size={20} />
                    </IconButton>
                </Tooltip>
            </ActionBox>
        </HeaderBox>
        <StyledTextField fullWidth multiline minRows={2} maxRows={4} value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} disabled={actionLoading} size="small" placeholder="Digite a mensagem de commit aqui..." />
        <StyledButton variant="contained" onClick={handleCommit} disabled={actionLoading || !commitMessage.trim() || serverStatus !== 'connected'} startIcon={<VscGitCommit size={20} />} fullWidth disableElevation>
            Commitar Alterações
        </StyledButton>
    </CommitPaper>
);