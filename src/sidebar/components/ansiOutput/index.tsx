import { useMemo } from 'react'

import { AnsiSpan } from './styles'

import type { AnsiOutputProps } from './types'
import type { CSSProperties } from 'react'

const AnsiOutput = ({ text }: AnsiOutputProps) => {
  const parsedContent = useMemo(() => {
    if (!text) return null

    const parts = text.split(/(\x1b\[[\d;]*m)/g)
    let currentStyle: CSSProperties = {}

    return parts.map((part, i) => {
      if (part.match(/^\x1b\[[\d;]*m$/)) {
        const codes = part.slice(2, -1).split(';').map(Number)

        codes.forEach(c => {
          if (c === 0) currentStyle = {}
          else if (c === 1) currentStyle.fontWeight = 'bold'
          else if (c === 2) currentStyle.opacity = 0.7
          else if (c === 22) delete currentStyle.fontWeight
          else if (c === 39) delete currentStyle.color
          else if (c >= 30 && c <= 37) currentStyle.color = ['#000000', '#ef5350', '#66bb6a', '#ffa726', '#42a5f5', '#ab47bc', '#29b6f6', '#eeeeee'][c - 30]
        })

        return null
      }

      return (
        <AnsiSpan key={i} customstyle={{ ...currentStyle }}>
          {part}
        </AnsiSpan>
      )
    })
  }, [text])

  return (
    <>
      {parsedContent}
    </>
  )
}

export default AnsiOutput