import type { FileNode, ServerStatus } from '@/sidebar/types'

type TreeViewerProps = {
    projectStructure: FileNode | null
    searchTerm: string
    setSearchTerm: (s: string) => void
    isCopyMode: boolean
    setIsCopyMode: (m: boolean) => void
    persistSelection: boolean
    setPersistSelection: (p: boolean) => void
    selectedPaths: Set<string>
    expandedPaths: Set<string>
    pinnedPaths: Set<string>
    handleCopyPath: (p: string) => void
    handleToggleSelection: (n: FileNode, s: boolean) => void
    handleToggleExpansion: (p: string) => void
    handleTogglePin: (p: string) => void
    serverStatus: ServerStatus
    isChecking: boolean
    loading: boolean
    handleFetchStructure: () => void
}

export default TreeViewerProps