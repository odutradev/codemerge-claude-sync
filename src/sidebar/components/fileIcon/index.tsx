import { SiJavascript, SiTypescript, SiHtml5, SiCss3, SiReact, SiPython, SiCplusplus, SiCsharp, SiRust, SiGo, SiPhp, SiRuby, SiMarkdown, SiDocker, SiGnubash, SiPostgresql, SiSass, SiLess, SiKotlin, SiSwift, SiDart, SiLua, SiNpm } from 'react-icons/si'
import { VscFile, VscFileBinary, VscFilePdf, VscFileMedia, VscFileZip, VscTerminal, VscDatabase, VscJson } from 'react-icons/vsc'
import { useTheme } from '@mui/material/styles'
import { FaJava, FaFileCode } from 'react-icons/fa'

import { IconWrapper } from './styles'

import type { FileIconProps } from './types'

const FileIcon = ({ fileName }: FileIconProps) => {
    const { palette: { fileColors: fc } } = useTheme() as Record<string, any>
    const ext = fileName ? fileName.split('.').pop()?.toLowerCase() || '' : ''
    const name = fileName ? fileName.toLowerCase() : ''

    if (name === 'dockerfile') return <IconWrapper customcolor={fc.docker}><SiDocker /></IconWrapper>
    if (name === 'makefile') return <IconWrapper customcolor={fc.makefile}><VscTerminal /></IconWrapper>
    if (name === 'package.json') return <IconWrapper customcolor={fc.npm}><SiNpm /></IconWrapper>
    if (name === 'tsconfig.json') return <IconWrapper customcolor={fc.typescript}><SiTypescript /></IconWrapper>

    switch (ext) {
        case 'js': case 'mjs': case 'cjs': return <IconWrapper customcolor={fc.javascript}><SiJavascript /></IconWrapper>
        case 'jsx': case 'tsx': return <IconWrapper customcolor={fc.react}><SiReact /></IconWrapper>
        case 'ts': return <IconWrapper customcolor={fc.typescript}><SiTypescript /></IconWrapper>
        case 'html': case 'htm': return <IconWrapper customcolor={fc.html}><SiHtml5 /></IconWrapper>
        case 'css': return <IconWrapper customcolor={fc.css}><SiCss3 /></IconWrapper>
        case 'scss': case 'sass': return <IconWrapper customcolor={fc.sass}><SiSass /></IconWrapper>
        case 'less': return <IconWrapper customcolor={fc.less}><SiLess /></IconWrapper>
        case 'json': case 'json5': case 'map': return <IconWrapper customcolor={fc.json}><VscJson /></IconWrapper>
        case 'xml': case 'yaml': case 'yml': case 'toml': case 'config': case 'ini': case 'env': return <IconWrapper customcolor={fc.config}><FaFileCode /></IconWrapper>
        case 'csv': case 'xls': case 'xlsx': return <IconWrapper customcolor={fc.csv}><VscDatabase /></IconWrapper>
        case 'md': case 'markdown': return <IconWrapper customcolor={fc.markdown}><SiMarkdown /></IconWrapper>
        case 'txt': case 'log': return <IconWrapper customcolor={fc.text}><VscFile /></IconWrapper>
        case 'pdf': return <IconWrapper customcolor={fc.pdf}><VscFilePdf /></IconWrapper>
        case 'java': case 'class': case 'jar': return <IconWrapper customcolor={fc.java}><FaJava /></IconWrapper>
        case 'py': case 'pyc': case 'pyd': return <IconWrapper customcolor={fc.python}><SiPython /></IconWrapper>
        case 'c': case 'h': return <IconWrapper customcolor={fc.c}><SiCplusplus /></IconWrapper>
        case 'cpp': case 'hpp': case 'cc': return <IconWrapper customcolor={fc.cpp}><SiCplusplus /></IconWrapper>
        case 'cs': return <IconWrapper customcolor={fc.csharp}><SiCsharp /></IconWrapper>
        case 'php': return <IconWrapper customcolor={fc.php}><SiPhp /></IconWrapper>
        case 'go': return <IconWrapper customcolor={fc.go}><SiGo /></IconWrapper>
        case 'rs': return <IconWrapper customcolor={fc.rust}><SiRust /></IconWrapper>
        case 'rb': return <IconWrapper customcolor={fc.ruby}><SiRuby /></IconWrapper>
        case 'kt': case 'kts': return <IconWrapper customcolor={fc.kotlin}><SiKotlin /></IconWrapper>
        case 'swift': return <IconWrapper customcolor={fc.swift}><SiSwift /></IconWrapper>
        case 'dart': return <IconWrapper customcolor={fc.dart}><SiDart /></IconWrapper>
        case 'lua': return <IconWrapper customcolor={fc.lua}><SiLua /></IconWrapper>
        case 'sql': return <IconWrapper customcolor={fc.sql}><SiPostgresql /></IconWrapper>
        case 'sqlite': case 'db': return <IconWrapper customcolor={fc.db}><VscDatabase /></IconWrapper>
        case 'sh': case 'bash': case 'zsh': return <IconWrapper customcolor={fc.bash}><SiGnubash /></IconWrapper>
        case 'bat': case 'cmd': case 'ps1': return <IconWrapper customcolor={fc.terminal}><VscTerminal /></IconWrapper>
        case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': case 'ico': case 'webp': return <IconWrapper customcolor={fc.media}><VscFileMedia /></IconWrapper>
        case 'zip': case 'rar': case '7z': case 'tar': case 'gz': return <IconWrapper customcolor={fc.zip}><VscFileZip /></IconWrapper>
        default: return <IconWrapper customcolor={fc.text}><VscFileBinary /></IconWrapper>
    }
}

export default FileIcon