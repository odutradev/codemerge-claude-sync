import { SiJavascript, SiTypescript, SiHtml5, SiCss3, SiReact, SiPython, SiCplusplus, SiCsharp, SiRust, SiGo, SiPhp, SiRuby, SiMarkdown, SiDocker, SiGnubash, SiPostgresql, SiSass, SiLess, SiKotlin, SiSwift, SiDart, SiLua, SiNpm } from 'react-icons/si';
import { VscFile, VscFileBinary, VscFilePdf, VscFileMedia, VscFileZip, VscTerminal, VscDatabase, VscJson } from 'react-icons/vsc';
import { FaJava, FaFileCode } from 'react-icons/fa';

import { IconWrapper } from './styles';
import type { FileIconProps } from './types';

const FileIcon = ({ fileName, sx = {} }: FileIconProps) => {
    const ext = fileName ? fileName.split('.').pop()?.toLowerCase() || '' : '';
    const name = fileName ? fileName.toLowerCase() : '';
    if (name === 'dockerfile') return <IconWrapper customcolor="#2496ED" sx={sx}><SiDocker /></IconWrapper>;
    if (name === 'makefile') return <IconWrapper customcolor="#666666" sx={sx}><VscTerminal /></IconWrapper>;
    if (name === 'package.json') return <IconWrapper customcolor="#CB3837" sx={sx}><SiNpm /></IconWrapper>;
    if (name === 'tsconfig.json') return <IconWrapper customcolor="#3178C6" sx={sx}><SiTypescript /></IconWrapper>;
    switch (ext) {
        case 'js': case 'mjs': case 'cjs': return <IconWrapper customcolor="#F7DF1E" sx={sx}><SiJavascript /></IconWrapper>;
        case 'jsx': case 'tsx': return <IconWrapper customcolor="#61DAFB" sx={sx}><SiReact /></IconWrapper>;
        case 'ts': return <IconWrapper customcolor="#3178C6" sx={sx}><SiTypescript /></IconWrapper>;
        case 'html': case 'htm': return <IconWrapper customcolor="#E34C26" sx={sx}><SiHtml5 /></IconWrapper>;
        case 'css': return <IconWrapper customcolor="#1572B6" sx={sx}><SiCss3 /></IconWrapper>;
        case 'scss': case 'sass': return <IconWrapper customcolor="#CC6699" sx={sx}><SiSass /></IconWrapper>;
        case 'less': return <IconWrapper customcolor="#1D365D" sx={sx}><SiLess /></IconWrapper>;
        case 'json': case 'json5': case 'map': return <IconWrapper customcolor="#F7DF1E" sx={sx}><VscJson /></IconWrapper>;
        case 'xml': case 'yaml': case 'yml': case 'toml': case 'config': case 'ini': case 'env': return <IconWrapper customcolor="#6E7681" sx={sx}><FaFileCode /></IconWrapper>;
        case 'csv': case 'xls': case 'xlsx': return <IconWrapper customcolor="#217346" sx={sx}><VscDatabase /></IconWrapper>;
        case 'md': case 'markdown': return <IconWrapper customcolor="#ffffff" sx={sx}><SiMarkdown /></IconWrapper>;
        case 'txt': case 'log': return <IconWrapper customcolor="#9E9E9E" sx={sx}><VscFile /></IconWrapper>;
        case 'pdf': return <IconWrapper customcolor="#F44336" sx={sx}><VscFilePdf /></IconWrapper>;
        case 'java': case 'class': case 'jar': return <IconWrapper customcolor="#007396" sx={sx}><FaJava /></IconWrapper>;
        case 'py': case 'pyc': case 'pyd': return <IconWrapper customcolor="#3776AB" sx={sx}><SiPython /></IconWrapper>;
        case 'c': case 'h': return <IconWrapper customcolor="#A8B9CC" sx={sx}><SiCplusplus /></IconWrapper>;
        case 'cpp': case 'hpp': case 'cc': return <IconWrapper customcolor="#00599C" sx={sx}><SiCplusplus /></IconWrapper>;
        case 'cs': return <IconWrapper customcolor="#239120" sx={sx}><SiCsharp /></IconWrapper>;
        case 'php': return <IconWrapper customcolor="#777BB4" sx={sx}><SiPhp /></IconWrapper>;
        case 'go': return <IconWrapper customcolor="#00ADD8" sx={sx}><SiGo /></IconWrapper>;
        case 'rs': return <IconWrapper customcolor="#DEA584" sx={sx}><SiRust /></IconWrapper>;
        case 'rb': return <IconWrapper customcolor="#CC342D" sx={sx}><SiRuby /></IconWrapper>;
        case 'kt': case 'kts': return <IconWrapper customcolor="#7F52FF" sx={sx}><SiKotlin /></IconWrapper>;
        case 'swift': return <IconWrapper customcolor="#F05138" sx={sx}><SiSwift /></IconWrapper>;
        case 'dart': return <IconWrapper customcolor="#0175C2" sx={sx}><SiDart /></IconWrapper>;
        case 'lua': return <IconWrapper customcolor="#2C2D72" sx={sx}><SiLua /></IconWrapper>;
        case 'sql': return <IconWrapper customcolor="#336791" sx={sx}><SiPostgresql /></IconWrapper>;
        case 'sqlite': case 'db': return <IconWrapper customcolor="#607D8B" sx={sx}><VscDatabase /></IconWrapper>;
        case 'sh': case 'bash': case 'zsh': return <IconWrapper customcolor="#4EAA25" sx={sx}><SiGnubash /></IconWrapper>;
        case 'bat': case 'cmd': case 'ps1': return <IconWrapper customcolor="#455A64" sx={sx}><VscTerminal /></IconWrapper>;
        case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': case 'ico': case 'webp': return <IconWrapper customcolor="#9C27B0" sx={sx}><VscFileMedia /></IconWrapper>;
        case 'zip': case 'rar': case '7z': case 'tar': case 'gz': return <IconWrapper customcolor="#FDD835" sx={sx}><VscFileZip /></IconWrapper>;
        default: return <IconWrapper customcolor="#9E9E9E" sx={sx}><VscFileBinary /></IconWrapper>;
    }
};

export default FileIcon;