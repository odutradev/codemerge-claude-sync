import React from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import JavascriptIcon from '@mui/icons-material/Javascript';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import TerminalIcon from '@mui/icons-material/Terminal';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import TableChartIcon from '@mui/icons-material/TableChart';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

const FileIcon = ({ fileName, sx = {} }) => {
    const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';

    const iconProps = { 
        fontSize: "small", 
        sx: { ...sx } 
    };

    switch (ext) {
        case 'js':
        case 'mjs':
        case 'cjs':
            return <JavascriptIcon {...iconProps} sx={{ ...sx, color: '#f7df1e' }} />;
        case 'jsx':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#61dafb' }} />;
        case 'ts':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#3178c6' }} />;
        case 'tsx':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#3178c6' }} />;
        case 'html':
        case 'htm':
            return <HtmlIcon {...iconProps} sx={{ ...sx, color: '#e34c26' }} />;
        case 'css':
        case 'scss':
        case 'sass':
        case 'less':
            return <CssIcon {...iconProps} sx={{ ...sx, color: '#264de4' }} />;
        case 'json':
        case 'json5':
        case 'map':
            return <DataObjectIcon {...iconProps} sx={{ ...sx, color: '#ffd700' }} />;
        case 'xml':
        case 'yaml':
        case 'yml':
        case 'toml':
        case 'config':
        case 'ini':
            return <IntegrationInstructionsIcon {...iconProps} sx={{ ...sx, color: '#607d8b' }} />;
        case 'csv':
        case 'xls':
        case 'xlsx':
            return <TableChartIcon {...iconProps} sx={{ ...sx, color: '#4caf50' }} />;
        case 'md':
        case 'markdown':
            return <ArticleIcon {...iconProps} sx={{ ...sx, color: '#000000' }} />;
        case 'txt':
        case 'log':
            return <DescriptionIcon {...iconProps} sx={{ ...sx, color: '#9e9e9e' }} />;
        case 'pdf':
            return <DescriptionIcon {...iconProps} sx={{ ...sx, color: '#f44336' }} />;
        case 'java':
        case 'class':
        case 'jar':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#b07219' }} />;
        case 'py':
        case 'pyc':
        case 'pyd':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#306998' }} />;
        case 'c':
        case 'h':
        case 'cpp':
        case 'hpp':
        case 'cc':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#00599C' }} />;
        case 'cs':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#178600' }} />;
        case 'php':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#4F5D95' }} />;
        case 'go':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#00ADD8' }} />;
        case 'rs':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#dea584' }} />;
        case 'rb':
            return <CodeIcon {...iconProps} sx={{ ...sx, color: '#CC342D' }} />;
        case 'sql':
            return <TableChartIcon {...iconProps} sx={{ ...sx, color: '#e38c00' }} />;
        case 'sh':
        case 'bash':
        case 'zsh':
        case 'bat':
        case 'cmd':
        case 'ps1':
        case 'env':
        case 'gitignore':
        case 'dockerfile':
            return <TerminalIcon {...iconProps} sx={{ ...sx, color: '#455a64' }} />;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
        case 'ico':
        case 'webp':
            return <ImageIcon {...iconProps} sx={{ ...sx, color: '#9c27b0' }} />;
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return <FolderZipIcon {...iconProps} sx={{ ...sx, color: '#fdd835' }} />;
        default:
            return <InsertDriveFileIcon {...iconProps} color="disabled" sx={{ ...sx }} />;
    }
};

export default FileIcon;