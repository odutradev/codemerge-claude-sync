import { Button, Typography, Box } from '@mui/material'
import { MdPerson } from 'react-icons/md'
import { FaGithub } from 'react-icons/fa'

import Section from '@/sidebar/tabs/settings/components/section'
import { CreatorInfo, CreatorName } from './styles'

const Creator = () => {
    const handleOpenGitHub = () => window.open('https://github.com/odutradev', '_blank')

    return (
        <Section title="Sobre o Criador" icon={<MdPerson size={20} />} borderColor="primary.main" tooltip="Desenvolvedor e idealizador do CodeMerge Sync.">
            <CreatorInfo>
                <Box>
                    <CreatorName variant="body2">João Dutra</CreatorName>
                    <Typography variant="caption" color="text.secondary">
                        @odutradev
                    </Typography>
                </Box>
                <Button variant="contained" color="primary" size="small" startIcon={<FaGithub size={16} />} onClick={handleOpenGitHub}>
                    GitHub
                </Button>
            </CreatorInfo>
        </Section>
    )
}

export default Creator