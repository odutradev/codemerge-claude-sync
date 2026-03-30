import { MdInfoOutline } from 'react-icons/md'
import { Tooltip } from '@mui/material'

import { SectionContainer, SectionHeader, TitleContainer, IconWrapper, InfoWrapper } from './styles'

import type { SectionProps } from './types'

const Section = ({ title, icon, borderColor, tooltip, children }: SectionProps) => (
    <SectionContainer variant="outlined" $borderColor={borderColor}>
        <SectionHeader>
            {icon && <IconWrapper $color={borderColor}>{icon}</IconWrapper>}
            <TitleContainer variant="subtitle2">{title}</TitleContainer>
            {tooltip && (
                <Tooltip title={tooltip} placement="top" arrow>
                    <InfoWrapper>
                        <MdInfoOutline size={18} />
                    </InfoWrapper>
                </Tooltip>
            )}
        </SectionHeader>
        {children}
    </SectionContainer>
)

export default Section