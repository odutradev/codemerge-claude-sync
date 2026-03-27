type SyncStatsProps = {
    stats: {
        files: number
        lines: number
        lastUpdate: string
    }
    pinnedCount: number
    handleSync: () => void
    loading: boolean
    serverStatus: string
    hasSelection: boolean
}

export default SyncStatsProps