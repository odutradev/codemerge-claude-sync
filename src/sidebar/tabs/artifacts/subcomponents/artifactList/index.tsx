import { CircularProgress, Typography, Tooltip, List } from '@mui/material'
import { MdDeselect, MdUpload, MdDelete } from 'react-icons/md'

import { LoadingContainer, StyledPaper, HeaderBox, ClearButton, StyledList, StyledListItem, DeleteListItem, ItemContentBox, DeleteCheckbox, StandardCheckbox, IconWrapperBox, TextWrapperBox, DeleteText, HeaderTitle, DeleteIconWrapper, ArtifactNameText, ArtifactLinesText } from './styles'
import ActionButton from '@/sidebar/components/actionButton'
import EmptyState from '@/sidebar/components/emptyState'
import FileIcon from '@/sidebar/components/fileIcon'

import type { ArtifactListProps } from './types'

const ArtifactList = ({ fetching, artifacts, filesToDelete, selectedIndices, selectedDeletions, toggleSelection, toggleDeleteSelection, handleDeselectAll, handleApplyAll, actionLoading, serverStatus }: ArtifactListProps) => {
    if (fetching) {
        return (
            <LoadingContainer>
                <CircularProgress size={24} />
            </LoadingContainer>
        )
    }

    const totalItems = artifacts.length + filesToDelete.length
    const totalSelected = selectedIndices.size + selectedDeletions.size

    if (totalItems === 0) {
        return <EmptyState message="Nenhum artefato ou arquivo para apagar" icon={<MdDeselect />} />
    }

    return (
        <>
            <StyledPaper elevation={0} variant="outlined">
                <HeaderBox>
                    <HeaderTitle variant="caption">
                        {totalItems} ARQUIVOS ({filesToDelete.length} PARA APAGAR)
                    </HeaderTitle>
                    <ClearButton
                        size="small"
                        onClick={handleDeselectAll}
                        disabled={totalSelected === 0 || actionLoading}
                    >
                        Limpar Seleção
                    </ClearButton>
                </HeaderBox>

                <StyledList component={List}>
                    {filesToDelete.map((path) => (
                        <DeleteListItem
                            key={`del-${path}`}
                            onClick={() => toggleDeleteSelection(path)}
                            isSelected={selectedDeletions.has(path)}
                        >
                            <ItemContentBox>
                                <DeleteCheckbox
                                    checked={selectedDeletions.has(path)}
                                    size="small"
                                />
                                <IconWrapperBox isError={true}>
                                    <FileIcon fileName={path} />
                                </IconWrapperBox>
                                <TextWrapperBox>
                                    <Tooltip title={path} placement="top-start" enterDelay={500}>
                                        <DeleteText
                                            variant="body2"
                                            noWrap
                                            isSelected={selectedDeletions.has(path)}
                                        >
                                            {path}
                                        </DeleteText>
                                    </Tooltip>
                                </TextWrapperBox>
                                <DeleteIconWrapper>
                                    <MdDelete />
                                </DeleteIconWrapper>
                            </ItemContentBox>
                        </DeleteListItem>
                    ))}

                    {artifacts.map((artifact, index) => (
                        <StyledListItem
                            key={`art-${index}`}
                            onClick={() => toggleSelection(index)}
                            isSelected={selectedIndices.has(index)}
                        >
                            <ItemContentBox>
                                <StandardCheckbox
                                    checked={selectedIndices.has(index)}
                                    size="small"
                                />
                                <IconWrapperBox>
                                    <FileIcon fileName={artifact.name} />
                                </IconWrapperBox>
                                <TextWrapperBox>
                                    <Tooltip title={artifact.name} placement="top-start" enterDelay={500}>
                                        <ArtifactNameText variant="body2" noWrap>
                                            {artifact.name}
                                        </ArtifactNameText>
                                    </Tooltip>
                                </TextWrapperBox>
                                <ArtifactLinesText variant="caption">
                                    {artifact.code.split('\n').length}
                                </ArtifactLinesText>
                            </ItemContentBox>
                        </StyledListItem>
                    ))}
                </StyledList>
            </StyledPaper>

            <ActionButton
                variant="contained"
                icon={<MdUpload size={20} />}
                onClick={handleApplyAll}
                disabled={actionLoading || totalSelected === 0 || serverStatus !== 'connected'}
                loading={actionLoading}
                fullWidth
            >
                Aplicar Sincronização
            </ActionButton>
        </>
    )
}

export default ArtifactList