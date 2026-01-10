import React from 'react';
import { 
    SiJavascript, 
    SiTypescript, 
    SiHtml5, 
    SiCss3, 
    SiReact, 
    SiPython, 
    SiCplusplus, 
    SiCsharp, 
    SiRust, 
    SiGo, 
    SiPhp, 
    SiRuby, 
    SiMarkdown,
    SiDocker,
    SiGnubash,
    SiPostgresql,
    SiSass,
    SiLess,
    SiKotlin,
    SiSwift,
    SiDart,
    SiLua,
    SiNpm
} from 'react-icons/si';
import { VscJson } from "react-icons/vsc";

import { 
    VscFile, 
    VscFileBinary, 
    VscFilePdf, 
    VscFileMedia, 
    VscFileZip,
    VscTerminal,
    VscDatabase
} from 'react-icons/vsc';

import { FaJava, FaFileCode } from 'react-icons/fa';

const FileIcon = ({ fileName, sx = {} }) => {
    const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';
    const name = fileName ? fileName.toLowerCase() : '';

    const iconStyle = { 
        fontSize: "1rem", 
        verticalAlign: "middle",
        ...sx 
    };

    if (name === 'dockerfile') return <SiDocker style={{ ...iconStyle, color: '#2496ED' }} />;
    if (name === 'makefile') return <VscTerminal style={{ ...iconStyle, color: '#666666' }} />;
    if (name === 'package.json') return <SiNpm  style={{ ...iconStyle, color: '#CB3837' }} />;
    if (name === 'tsconfig.json') return <SiTypescript style={{ ...iconStyle, color: '#3178C6' }} />;

    switch (ext) {
        case 'js':
        case 'mjs':
        case 'cjs':
            return <SiJavascript style={{ ...iconStyle, color: '#F7DF1E' }} />;
        case 'jsx':
            return <SiReact style={{ ...iconStyle, color: '#61DAFB' }} />;
        case 'ts':
            return <SiTypescript style={{ ...iconStyle, color: '#3178C6' }} />;
        case 'tsx':
            return <SiReact style={{ ...iconStyle, color: '#61DAFB' }} />;
        case 'html':
        case 'htm':
            return <SiHtml5 style={{ ...iconStyle, color: '#E34C26' }} />;
        case 'css':
            return <SiCss3 style={{ ...iconStyle, color: '#1572B6' }} />;
        case 'scss':
        case 'sass':
            return <SiSass style={{ ...iconStyle, color: '#CC6699' }} />;
        case 'less':
            return <SiLess style={{ ...iconStyle, color: '#1D365D' }} />;
        
        case 'json':
        case 'json5':
        case 'map':
            return <VscJson style={{ ...iconStyle, color: '#F7DF1E' }} />;
        case 'xml':
        case 'yaml':
        case 'yml':
        case 'toml':
        case 'config':
        case 'ini':
        case 'env':
            return <FaFileCode style={{ ...iconStyle, color: '#6E7681' }} />;
        
        case 'csv':
        case 'xls':
        case 'xlsx':
            return <VscDatabase style={{ ...iconStyle, color: '#217346' }} />;
        
        case 'md':
        case 'markdown':
            return <SiMarkdown style={{ ...iconStyle, color: '#ffffff' }} />;
        case 'txt':
        case 'log':
            return <VscFile style={{ ...iconStyle, color: '#9E9E9E' }} />;
        case 'pdf':
            return <VscFilePdf style={{ ...iconStyle, color: '#F44336' }} />;

        case 'java':
        case 'class':
        case 'jar':
            return <FaJava style={{ ...iconStyle, color: '#007396' }} />;
        case 'py':
        case 'pyc':
        case 'pyd':
            return <SiPython style={{ ...iconStyle, color: '#3776AB' }} />;
        case 'c':
        case 'h':
            return <SiCplusplus style={{ ...iconStyle, color: '#A8B9CC' }} />;
        case 'cpp':
        case 'hpp':
        case 'cc':
            return <SiCplusplus style={{ ...iconStyle, color: '#00599C' }} />;
        case 'cs':
            return <SiCsharp style={{ ...iconStyle, color: '#239120' }} />;
        case 'php':
            return <SiPhp style={{ ...iconStyle, color: '#777BB4' }} />;
        case 'go':
            return <SiGo style={{ ...iconStyle, color: '#00ADD8' }} />;
        case 'rs':
            return <SiRust style={{ ...iconStyle, color: '#DEA584' }} />;
        case 'rb':
            return <SiRuby style={{ ...iconStyle, color: '#CC342D' }} />;
        case 'kt':
        case 'kts':
            return <SiKotlin style={{ ...iconStyle, color: '#7F52FF' }} />;
        case 'swift':
            return <SiSwift style={{ ...iconStyle, color: '#F05138' }} />;
        case 'dart':
            return <SiDart style={{ ...iconStyle, color: '#0175C2' }} />;
        case 'lua':
            return <SiLua style={{ ...iconStyle, color: '#2C2D72' }} />;

        case 'sql':
            return <SiPostgresql style={{ ...iconStyle, color: '#336791' }} />;
        case 'sqlite':
        case 'db':
            return <VscDatabase style={{ ...iconStyle, color: '#607D8B' }} />;

        case 'sh':
        case 'bash':
        case 'zsh':
            return <SiGnubash style={{ ...iconStyle, color: '#4EAA25' }} />;
        case 'bat':
        case 'cmd':
        case 'ps1':
            return <VscTerminal style={{ ...iconStyle, color: '#455A64' }} />;

        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
        case 'ico':
        case 'webp':
            return <VscFileMedia style={{ ...iconStyle, color: '#9C27B0' }} />;
        
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return <VscFileZip style={{ ...iconStyle, color: '#FDD835' }} />;
            
        default:
            return <VscFileBinary style={{ ...iconStyle, color: '#9E9E9E' }} />;
    }
};

export default FileIcon;