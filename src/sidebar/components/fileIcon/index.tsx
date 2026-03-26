import { SiJavascript, SiTypescript, SiHtml5, SiCss3, SiReact, SiPython, SiCplusplus, SiCsharp, SiRust, SiGo, SiPhp, SiRuby, SiMarkdown, SiDocker, SiGnubash, SiPostgresql, SiSass, SiLess, SiKotlin, SiSwift, SiDart, SiLua, SiNpm } from 'react-icons/si';
import { VscFile, VscFileBinary, VscFilePdf, VscFileMedia, VscFileZip, VscTerminal, VscDatabase, VscJson } from 'react-icons/vsc';
import { FaJava, FaFileCode } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

import { IconWrapper } from './styles';
import type { FileIconProps } from './types';

const FileIcon = ({ fileName, sx = {} }: FileIconProps) => {
    const { palette: { fileColors: fc } } = useTheme();
    const ext = fileName ? fileName.split('.').pop()?.toLowerCase() || '' : '';
    const name = fileName ? fileName.toLowerCase() : '';

    if (name === 'dockerfile') return <IconWrapper customcolor={fc.docker} sx={sx}><SiDocker /></IconWrapper>;
    if (name === 'makefile') return <IconWrapper customcolor={fc.makefile} sx={sx}><VscTerminal /></IconWrapper>;
    if (name === 'package.json') return <IconWrapper customcolor={fc.npm} sx={sx}><SiNpm /></IconWrapper>;
    if (name === 'tsconfig.json') return <IconWrapper customcolor={fc.typescript} sx={sx}><SiTypescript /></IconWrapper>;

    switch (ext) {
        case 'js': case 'mjs': case 'cjs': return <IconWrapper customcolor={fc.javascript} sx={sx}><SiJavascript /></IconWrapper>;
        case 'jsx': case 'tsx': return <IconWrapper customcolor={fc.react} sx={sx}><SiReact /></IconWrapper>;
        case 'ts': return <IconWrapper customcolor={fc.typescript} sx={sx}><SiTypescript /></IconWrapper>;
        case 'html': case 'htm': return <IconWrapper customcolor={fc.html} sx={sx}><SiHtml5 /></IconWrapper>;
        case 'css': return <IconWrapper customcolor={fc.css} sx={sx}><SiCss3 /></IconWrapper>;
        case 'scss': case 'sass': return <IconWrapper customcolor={fc.sass} sx={sx}><SiSass /></IconWrapper>;
        case 'less': return <IconWrapper customcolor={fc.less} sx={sx}><SiLess /></IconWrapper>;
        case 'json': case 'json5': case 'map': return <IconWrapper customcolor={fc.json} sx={sx}><VscJson /></IconWrapper>;
        case 'xml': case 'yaml': case 'yml': case 'toml': case 'config': case 'ini': case 'env': return <IconWrapper customcolor={fc.config} sx={sx}><FaFileCode /></IconWrapper>;
        case 'csv': case 'xls': case 'xlsx': return <IconWrapper customcolor={fc.csv} sx={sx}><VscDatabase /></IconWrapper>;
        case 'md': case 'markdown': return <IconWrapper customcolor={fc.markdown} sx={sx}><SiMarkdown /></IconWrapper>;
        case 'txt': case 'log': return <IconWrapper customcolor={fc.text} sx={sx}><VscFile /></IconWrapper>;
        case 'pdf': return <IconWrapper customcolor={fc.pdf} sx={sx}><VscFilePdf /></IconWrapper>;
        case 'java': case 'class': case 'jar': return <IconWrapper customcolor={fc.java} sx={sx}><FaJava /></IconWrapper>;
        case 'py': case 'pyc': case 'pyd': return <IconWrapper customcolor={fc.python} sx={sx}><SiPython /></IconWrapper>;
        case 'c': case 'h': return <IconWrapper customcolor={fc.c} sx={sx}><SiCplusplus /></IconWrapper>;
        case 'cpp': case 'hpp': case 'cc': return <IconWrapper customcolor={fc.cpp} sx={sx}><SiCplusplus /></IconWrapper>;
        case 'cs': return <IconWrapper customcolor={fc.csharp} sx={sx}><SiCsharp /></IconWrapper>;
        case 'php': return <IconWrapper customcolor={fc.php} sx={sx}><SiPhp /></IconWrapper>;
        case 'go': return <IconWrapper customcolor={fc.go} sx={sx}><SiGo /></IconWrapper>;
        case 'rs': return <IconWrapper customcolor={fc.rust} sx={sx}><SiRust /></IconWrapper>;
        case 'rb': return <IconWrapper customcolor={fc.ruby} sx={sx}><SiRuby /></IconWrapper>;
        case 'kt': case 'kts': return <IconWrapper customcolor={fc.kotlin} sx={sx}><SiKotlin /></IconWrapper>;
        case 'swift': return <IconWrapper customcolor={fc.swift} sx={sx}><SiSwift /></IconWrapper>;
        case 'dart': return <IconWrapper customcolor={fc.dart} sx={sx}><SiDart /></IconWrapper>;
        case 'lua': return <IconWrapper customcolor={fc.lua} sx={sx}><SiLua /></IconWrapper>;
        case 'sql': return <IconWrapper customcolor={fc.sql} sx={sx}><SiPostgresql /></IconWrapper>;
        case 'sqlite': case 'db': return <IconWrapper customcolor={fc.db} sx={sx}><VscDatabase /></IconWrapper>;
        case 'sh': case 'bash': case 'zsh': return <IconWrapper customcolor={fc.bash} sx={sx}><SiGnubash /></IconWrapper>;
        case 'bat': case 'cmd': case 'ps1': return <IconWrapper customcolor={fc.terminal} sx={sx}><VscTerminal /></IconWrapper>;
        case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': case 'ico': case 'webp': return <IconWrapper customcolor={fc.media} sx={sx}><VscFileMedia /></IconWrapper>;
        case 'zip': case 'rar': case '7z': case 'tar': case 'gz': return <IconWrapper customcolor={fc.zip} sx={sx}><VscFileZip /></IconWrapper>;
        default: return <IconWrapper customcolor={fc.text} sx={sx}><VscFileBinary /></IconWrapper>;
    }
};

export default FileIcon;