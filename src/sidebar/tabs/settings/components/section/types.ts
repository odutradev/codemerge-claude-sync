import type { ReactNode } from 'react'

export interface SectionProps {
    title: string
    icon?: ReactNode
    borderColor?: string
    tooltip?: string
    children: ReactNode
}