import { Typography, CircularProgress, Tooltip, List } from '@mui/material';
import { MdDeselect, MdUpload, MdDelete } from 'react-icons/md';

import { LoadingContainer, EmptyBox, StyledPaper, HeaderBox, ClearButton, StyledList, StyledListItem, DeleteListItem, ItemContentBox, DeleteCheckbox, StandardCheckbox, IconWrapperBox, TextWrapperBox, DeleteText, ApplyButton } from './styles';
import FileIcon from '@/sidebar/components/fileIcon';

import type { ArtifactListProps } from './types';

const ArtifactList = ({ fetching, artifacts, filesToDelete, selectedIndices, selectedDeletions, toggleSelection, toggleDeleteSelection, handleDeselectAll, handleApplyAll, actionLoading, serverStatus }: ArtifactListProps) => {
    if (fetching) {
        return (
            <LoadingContainer>
                <CircularProgress size={24} />
            </LoadingContainer>
        );
    }

    const totalItems = artifacts.length + filesToDelete.length;
    const totalSelected = selectedIndices.size + selectedDeletions.size;

    if (totalItems === 0) {
        return (
            <EmptyBox>
                <MdDeselect size={40} style={{ color: 'rgba(0, 0, 0, 0.38)' }} />
                <Typography variant="body2" color="text.secondary">
                    Nenhum artefato ou arquivo para apagar
                </Typography>
            </EmptyBox>
        );
    }

    return (
        <>
            <StyledPaper elevation={0} variant="outlined">
                <HeaderBox>
                    <Typography variant="caption" style={{ fontWeight: 600, color: 'text.primary' }}>
                        {totalItems} ARQUIVOS ({filesToDelete.length} PARA APAGAR)
                    </Typography>
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
                            button
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
                                <MdDelete size={16} style={{ color: '#d32f2f', opacity: 0.7 }} />
                            </ItemContentBox>
                        </DeleteListItem>
                    ))}

                    {artifacts.map((artifact, index) => (
                        <StyledListItem
                            key={`art-${index}`}
                            button
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
                                        <Typography variant="body2" noWrap style={{ fontWeight: 500 }}>
                                            {artifact.name}
                                        </Typography>
                                    </Tooltip>
                                </TextWrapperBox>
                                <Typography variant="caption" color="text.secondary" style={{ fontFamily: 'monospace', opacity: 0.7 }}>
                                    {artifact.code.split('\n').length}
                                </Typography>
                            </ItemContentBox>
                        </StyledListItem>
                    ))}
                </StyledList>
            </StyledPaper>

            <ApplyButton
                variant="contained"
                onClick={handleApplyAll}
                disabled={actionLoading || totalSelected === 0 || serverStatus !== 'connected'}
                fullWidth
                disableElevation
                startIcon={<MdUpload size={20} />}
            >
                Aplicar Sincronização
            </ApplyButton>
        </>
    );
};

export default ArtifactList;