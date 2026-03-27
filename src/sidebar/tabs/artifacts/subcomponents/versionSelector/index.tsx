import { MdChevronRight, MdChevronLeft } from 'react-icons/md'

import { SelectorContainer, IndicatorText, NavButton } from './styles'

import type { VersionSelectorProps } from './types'

const VersionSelector = ({ historyLength, currentHistoryIndex, handlePrevHistory, handleNextHistory, loading }: VersionSelectorProps) => {
    if (historyLength <= 0) return null

    return (
        <SelectorContainer>
            <NavButton
                size="small"
                onClick={handlePrevHistory}
                disabled={currentHistoryIndex <= 0 || loading}
            >
                <MdChevronLeft size={18} />
            </NavButton>

            <IndicatorText>
                {currentHistoryIndex + 1}/{historyLength}
            </IndicatorText>

            <NavButton
                size="small"
                onClick={handleNextHistory}
                disabled={currentHistoryIndex >= historyLength - 1 || loading}
            >
                <MdChevronRight size={18} />
            </NavButton>
        </SelectorContainer>
    )
}

export default VersionSelector