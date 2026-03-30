import type { ReactNode } from 'react'

export interface RowProps {
    label?: string
    vertical?: boolean
    children: ReactNode
}