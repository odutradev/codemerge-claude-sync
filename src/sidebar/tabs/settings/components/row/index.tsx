import { RowContainer, RowLabel } from './styles'

import type { RowProps } from './types'

const Row = ({ label, vertical = false, children }: RowProps) => (
    <RowContainer $vertical={vertical}>
        {label && <RowLabel variant="caption">{label}</RowLabel>}
        {children}
    </RowContainer>
)

export default Row