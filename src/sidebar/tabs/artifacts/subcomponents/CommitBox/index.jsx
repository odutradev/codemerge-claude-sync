import { Box, Typography, Button, TextField, Paper, IconButton } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CommitIcon from '@mui/icons-material/Commit';

export const CommitBox = ({ commitMessage, setCommitMessage, originalCommitMessage, handleCommit, actionLoading, serverStatus }) => (
    <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>MENSAGEM DE COMMIT</Typography>
            <IconButton size="small" onClick={() => setCommitMessage(originalCommitMessage)} disabled={commitMessage === originalCommitMessage || actionLoading || !originalCommitMessage}>
                <RestartAltIcon fontSize="small" />
            </IconButton>
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