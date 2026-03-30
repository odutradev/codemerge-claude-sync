import { SectionContainer, SectionHeader, TitleContainer, IconWrapper } from './styles'

import type { SectionProps } from './types'

const Section = ({ title, icon, borderColor, children }: SectionProps) => (
    <SectionContainer variant="outlined" $borderColor={borderColor}>
        <SectionHeader>
            {icon && <IconWrapper $color={borderColor}>{icon}</IconWrapper>}
            <TitleContainer variant="subtitle2">{title}</TitleContainer>
        </SectionHeader>
        {children}
    </SectionContainer>
)

export default Section