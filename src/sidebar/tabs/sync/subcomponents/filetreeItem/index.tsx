import { MdKeyboardArrowRight, MdKeyboardArrowDown, MdStarOutline, MdFolderOpen, MdFolder, MdStar } from 'react-icons/md'
import { Collapse, Box, Typography } from '@mui/material'

import useConfigStore from '@/sidebar/stores/config'
import FileIcon from '@/sidebar/components/fileIcon'
import Styled from './styles'

import type { FileNode } from '@/sidebar/types'
import type FileTreeItemProps from './types'

const FileTreeItem = ({
    node,
    level = 0,
    selectedPaths,
    expandedPaths,
    pinnedPaths,
    isCopyMode = false,
    onCopyPath,
    onToggleSelection,
    onToggleExpansion,
    onTogglePin,
    searchTerm
}: FileTreeItemProps) => {
    const { compactMode } = useConfigStore()

    const isExpanded = (searchTerm && searchTerm.length > 0) || expandedPaths.has(node.path)
    const isPinned = node.type === 'file' && pinnedPaths.has(node.path)

    const getAllChildrenPaths = (n: FileNode): string[] => {
        const currentPath = n.type === 'file' ? [n.path] : []
        const childrenPaths = n.children ? n.children.flatMap(getAllChildrenPaths) : []
        return [...currentPath, ...childrenPaths]
    }

    const allDescendants = getAllChildrenPaths(node)
    const selectedDescendantsCount = allDescendants.filter(p => selectedPaths.has(p)).length
    const isFullySelected = allDescendants.length > 0 && selectedDescendantsCount === allDescendants.length
    const isPartiallySelected = selectedDescendantsCount > 0 && selectedDescendantsCount < allDescendants.length
    const isSelected = selectedPaths.has(node.path) || isFullySelected

    const checkVisibility = (n: FileNode, term: string): boolean => {
        if (n.name.toLowerCase().includes(term.toLowerCase())) return true
        if (n.children) {
            return n.children.some(c => checkVisibility(c, term))
        }
        return false
    }

    const isVisible = (): boolean => {
        if (!searchTerm) return true
        if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) return true
        if (node.children) {
            return node.children.some(child => checkVisibility(child, searchTerm))
        }
        return false
    }

    if (!isVisible()) return null

    const handleExpandClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onToggleExpansion(node.path)
    }

    const handleItemClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.action-btn')) return
        if (isCopyMode && onCopyPath) {
            return onCopyPath(node.path)
        }
        onToggleSelection(node, !isFullySelected)
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        onToggleSelection(node, !isFullySelected)
    }

    const handlePinClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onTogglePin) {
            onTogglePin(node.path)
        }
    }

    const iconSize = compactMode ? 18 : 20
    const dynamicPadding = compactMode ? `${0.25 + (level * 0.75)}rem` : `${0.5 + (level * 1)}rem`

    return (
        <Box>
            <Styled.ItemContainer
                onClick={handleItemClick}
                data-selected={isSelected || isPartiallySelected}
                style={{
                    paddingTop: compactMode ? 0 : '4px',
                    paddingBottom: compactMode ? 0 : '4px',
                    paddingLeft: dynamicPadding,
                    minHeight: compactMode ? 24 : 32
                }}
            >
                {node.type === 'directory' ? (
                    <Styled.ActionButton className="action-btn" size="small" onClick={handleExpandClick}>
                        {isExpanded ? <MdKeyboardArrowDown size={iconSize} /> : <MdKeyboardArrowRight size={iconSize} />}
                    </Styled.ActionButton>
                ) : (
                    <Styled.EmptySpace />
                )}

                {!isCopyMode && (
                    <Styled.StyledCheckbox
                        size="small"
                        checked={isSelected}
                        indeterminate={isPartiallySelected}
                        onChange={handleCheckboxChange}
                        style={{ '--icon-size': `${iconSize}px` } as React.CSSProperties}
                    />
                )}

                <Styled.InfoWrapper>
                    {node.type === 'directory' ? (
                        isExpanded ? (
                            <Box component={MdFolderOpen} style={{ marginRight: 8, color: 'var(--mui-palette-text-secondary)', fontSize: iconSize }} />
                        ) : (
                            <Box component={MdFolder} style={{ marginRight: 8, color: 'var(--mui-palette-text-secondary)', fontSize: iconSize }} />
                        )
                    ) : (
                        <Styled.FileIconWrapper style={{ '--icon-size': `${iconSize}px` } as React.CSSProperties}>
                            <FileIcon fileName={node.name} />
                        </Styled.FileIconWrapper>
                    )}

                    <Styled.FileName variant="body2" title={node.name} style={{ fontSize: compactMode ? '0.8rem' : '0.875rem' }}>
                        {node.name}
                    </Styled.FileName>

                    {node.type === 'file' && node.lines && !compactMode && (
                        <Typography variant="caption" color="text.secondary" style={{ marginLeft: 8 }}>
                            ({node.lines}L)
                        </Typography>
                    )}
                </Styled.InfoWrapper>

                {!isCopyMode && node.type === 'file' && onTogglePin && (
                    <Styled.StarButton
                        className="action-btn star-btn"
                        size="small"
                        onClick={handlePinClick}
                        data-pinned={isPinned}
                        style={{ opacity: isPinned ? 1 : 0 }}
                    >
                        {isPinned ? (
                            <Box component={MdStar} style={{ fontSize: iconSize - 2, color: 'var(--mui-palette-warning-main)' }} />
                        ) : (
                            <Box component={MdStarOutline} style={{ fontSize: iconSize - 2, color: 'var(--mui-palette-text-secondary)' }} />
                        )}
                    </Styled.StarButton>
                )}
            </Styled.ItemContainer>

            {node.children && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    {node.children.map((child) => (
                        <FileTreeItem
                            key={child.path}
                            node={child}
                            level={level + 1}
                            selectedPaths={selectedPaths}
                            expandedPaths={expandedPaths}
                            pinnedPaths={pinnedPaths}
                            isCopyMode={isCopyMode}
                            onCopyPath={onCopyPath}
                            onToggleSelection={onToggleSelection}
                            onToggleExpansion={onToggleExpansion}
                            onTogglePin={onTogglePin}
                            searchTerm={searchTerm}
                        />
                    ))}
                </Collapse>
            )}
        </Box>
    )
}

export default FileTreeItem