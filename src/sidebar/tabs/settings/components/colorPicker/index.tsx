import { MdColorLens } from 'react-icons/md'
import { useRef } from 'react'

import { ColorListContainer, ColorOption, PickerContainer, PickerButton, ColorIconWrapper, HiddenInput } from './styles'

import type { ColorPickerProps } from './types'

const ColorPicker = ({ value, onChange, predefinedColors = [] }: ColorPickerProps) => {
    const colorRef = useRef<HTMLInputElement>(null)

    return (
        <ColorListContainer>
            {predefinedColors.map(c => (
                <ColorOption
                    key={c}
                    $colorValue={c}
                    $isSelected={value === c}
                    onClick={() => onChange(c)}
                />
            ))}
            <PickerContainer>
                <PickerButton onClick={() => colorRef.current?.click()}>
                    <ColorIconWrapper $customColor={value}>
                        <MdColorLens size={20} />
                    </ColorIconWrapper>
                </PickerButton>
                <HiddenInput
                    ref={colorRef}
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </PickerContainer>
        </ColorListContainer>
    )
}

export default ColorPicker