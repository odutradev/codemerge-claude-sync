import type { FileNode } from '@/sidebar/types'

type FileTreeItemProps = {
    node: FileNode
    level?: number
    selectedPaths: Set<string>
    expandedPaths: Set<string>
    pinnedPaths: Set<string>
    isCopyMode?: boolean
    onCopyPath?: (path: string) => void
    onToggleSelection: (node: FileNode, shouldSelect: boolean) => void
    onToggleExpansion: (path: string) => void
    onTogglePin?: (path: string) => void
    searchTerm?: string
}

export default FileTreeItemProps