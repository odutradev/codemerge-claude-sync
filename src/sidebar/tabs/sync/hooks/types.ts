import type { FileNode, ServerStatus } from '@/sidebar/types'

type UseSyncReturn = {
    state: {
        projectStructure: FileNode | null
        searchTerm: string
        loading: boolean
        serverStatus: ServerStatus
        isChecking: boolean
        isCopyMode: boolean
        selectedPaths: Set<string>
        expandedPaths: Set<string>
        pinnedPaths: Set<string>
        stats: {
            files: number
            lines: number
            lastUpdate: string
        }
        serverUrl: string
        persistSelection: boolean
    }
    actions: {
        setSearchTerm: (s: string) => void
        setIsCopyMode: (m: boolean) => void
        handleCopyPath: (p: string) => void
        handleToggleSelection: (n: FileNode, s: boolean) => void
        handleToggleExpansion: (p: string) => void
        handleTogglePin: (p: string) => void
        handleFetchStructure: () => void
        handleSync: () => void
        setPersistSelection: (p: boolean) => void
    }
}

export default UseSyncReturn