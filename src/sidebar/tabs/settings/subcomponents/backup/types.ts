import type { ConfigState } from '@/sidebar/stores/config/types'
import type { Preset } from '@/sidebar/types'

export interface BackupData {
    codemergeBackup: boolean
    version: number
    config: Partial<ConfigState>
    presets: Omit<Preset, 'id'>[]
}