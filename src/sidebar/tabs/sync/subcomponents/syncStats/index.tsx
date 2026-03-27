import { MdFormatAlignLeft, MdInsertDriveFile, MdCloudUpload, MdAccessTime, MdStar } from 'react-icons/md'
import { Tooltip, Box, Typography } from '@mui/material'

import ActionButton from '@/sidebar/components/actionButton'
import Styled from './styles'

import type SyncStatsProps from './types'

const SyncStats = ({ stats, pinnedCount, handleSync, loading, serverStatus, hasSelection }: SyncStatsProps) => {
    return (
        <>
            <Styled.Container variant="outlined">
                <Styled.LayoutRow>
                    <Styled.MetricsGroup>
                        <Tooltip title="Arquivos selecionados">
                            <Styled.MetricItem>
                                <Box component={MdInsertDriveFile} style={{ fontSize: 16, color: 'var(--mui-palette-text-secondary)' }} />
                                <Styled.MetricValue variant="caption" color="text.secondary">
                                    {stats.files}
                                </Styled.MetricValue>
                            </Styled.MetricItem>
                        </Tooltip>

                        <Tooltip title="Total de linhas">
                            <Styled.MetricItem>
                                <Box component={MdFormatAlignLeft} style={{ fontSize: 16, color: 'var(--mui-palette-text-secondary)' }} />
                                <Styled.MetricValue variant="caption" color="text.secondary">
                                    {stats.lines}
                                </Styled.MetricValue>
                            </Styled.MetricItem>
                        </Tooltip>

                        <Tooltip title="Favoritos">
                            <Styled.MetricItem>
                                <Box component={MdStar} style={{ fontSize: 16, color: 'var(--mui-palette-text-secondary)' }} />
                                <Styled.MetricValue variant="caption" color="text.secondary">
                                    {pinnedCount}
                                </Styled.MetricValue>
                            </Styled.MetricItem>
                        </Tooltip>
                    </Styled.MetricsGroup>

                    <Tooltip title="Última atualização">
                        <Styled.MetricItem>
                            <Box component={MdAccessTime} style={{ fontSize: 16, color: 'var(--mui-palette-text-secondary)' }} />
                            <Typography variant="caption" color="text.secondary">
                                {stats.lastUpdate}
                            </Typography>
                        </Styled.MetricItem>
                    </Tooltip>
                </Styled.LayoutRow>
            </Styled.Container>

            <ActionButton
                variant="contained"
                icon={<MdCloudUpload size={20} />}
                onClick={handleSync}
                disabled={loading || !hasSelection || serverStatus !== 'connected'}
                loading={loading}
                fullWidth
            >
                Sincronizar Selecionados
            </ActionButton>
        </>
    )
}

export default SyncStats