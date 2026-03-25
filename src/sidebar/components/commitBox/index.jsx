import { Box, Typography, Button, TextField, Paper, IconButton, Select, MenuItem, Tooltip } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TranslateIcon from '@mui/icons-material/Translate';
import CommitIcon from '@mui/icons-material/Commit';

const COMMIT_TYPES = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];

export const CommitBox = ({ commitType, setCommitType, translateCommit, setTranslateCommit, commitMessage, setCommitMessage, originalCommitMessage, originalCommitType, handleCommit, actionLoading, serverStatus }) => (
    <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>MENSAGEM DE COMMIT</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <Select size="small" value={commitType} onChange={(e) => setCommitType(e.target.value)} disabled={actionLoading} sx={{ height: 28, fontSize: '0.75rem', fontFamily: 'monospace', mr: 0.5 }}>
                    {COMMIT_TYPES.map(type => <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{type}</MenuItem>)}
                </Select>
                <Tooltip title={translateCommit ? 'Tradução Automática: Ativada' : 'Tradução Automática: Desativada'}>
                    <IconButton size="small" onClick={() => setTranslateCommit(!translateCommit)} color={translateCommit ? 'primary' : 'default'} disabled={actionLoading}>
                        <TranslateIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Restaurar Mensagem Original">
                    <IconButton size="small" onClick={() => { setCommitMessage(originalCommitMessage); setCommitType(originalCommitType); }} disabled={(commitMessage === originalCommitMessage && commitType === originalCommitType) || actionLoading || !originalCommitMessage}>
                        <RestartAltIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
        <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            disabled={actionLoading}
            size="small"
            placeholder="Digite a mensagem de commit aqui..."
            sx={{ '& .MuiInputBase-root': { fontSize: '0.85rem', fontFamily: 'monospace' } }}
        />
        <Button
            variant="contained"
            onClick={handleCommit}
            disabled={actionLoading || !commitMessage.trim() || serverStatus !== 'connected'}
            startIcon={<CommitIcon />}
            fullWidth
            disableElevation
            sx={{ textTransform: 'none' }}
        >
            Commitar Alterações
        </Button>
    </Paper>
);