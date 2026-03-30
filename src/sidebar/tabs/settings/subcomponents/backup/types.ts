import type { ConfigState } from '@/sidebar/stores/config/types'
import type { Preset } from '@/sidebar/types'

export interface ConfigBackupData {
    codemergeConfigBackup: boolean
    version: number
    config: Partial<ConfigState>
}

export interface PresetBackupData {
    codemergePresetBackup: boolean
    version: number
    presets: Omit<Preset, 'id'>[]
}