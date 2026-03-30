export interface ColorPickerProps {
    value: string
    predefinedColors?: string[]
    onChange: (color: string) => void
}