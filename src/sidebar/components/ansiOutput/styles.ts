import { styled } from '@mui/material/styles'

import type { CSSProperties } from 'react'

export const AnsiSpan = styled('span')<{ customstyle: CSSProperties }>(({ customstyle }) => ({
  ...customstyle
}))