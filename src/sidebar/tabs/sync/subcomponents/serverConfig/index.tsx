import { InputAdornment, CircularProgress } from '@mui/material'
import { MdRefresh } from 'react-icons/md'

import { ServerStatusIndicator } from '@/sidebar/components/serverStatusIndicator'
import { getStatusProps } from '@/sidebar/components/serverStatusIndicator/styles'
import Styled from './styles'

import type ServerConfigProps from './types'

const ServerConfig = ({
    serverUrl,
    setServerUrl,
    handleFetchStructure,
    loading,
    isChecking,
    serverStatus
}: ServerConfigProps) => {
    const props = getStatusProps(serverStatus, isChecking)

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setServerUrl(e.target.value)
    }

    return (
        <Styled.Container>
            <Styled.Label variant="caption">
                URL do Servidor
            </Styled.Label>
            
            <Styled.InputRow>
                <Styled.AnimatedTextField
                    fullWidth
                    size="small"
                    value={serverUrl}
                    onChange={handleUrlChange}
                    style={{
                        '--status-animation': props.animation,
                        '--status-border-color': props.borderColor
                    } as React.CSSProperties}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <ServerStatusIndicator
                                    status={serverStatus}
                                    isChecking={isChecking}
                                    showText={false}
                                />
                            </InputAdornment>
                        )
                    }}
                />
                
                <Styled.ActionButton
                    variant="outlined"
                    onClick={handleFetchStructure}
                    disabled={loading || isChecking || serverStatus !== 'connected'}
                >
                    {loading ? <CircularProgress size={20} /> : <MdRefresh size={20} />}
                </Styled.ActionButton>
            </Styled.InputRow>
        </Styled.Container>
    )
}

export default ServerConfig