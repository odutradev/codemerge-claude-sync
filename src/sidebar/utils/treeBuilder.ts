import type { FileNode } from '@/sidebar/types';

export const buildTreeFromPaths = (paths: string[]): FileNode => {
    const root: FileNode = { path: '', name: 'root', type: 'directory', children: [] };
    paths.forEach(path => {
        const parts = path.split('/');
        let current = root;
        parts.forEach((part, i) => {
            const isFile = i === parts.length - 1;
            const nodePath = parts.slice(0, i + 1).join('/');
            let child = current.children?.find(c => c.name === part);
            if (!child) {
                child = { path: nodePath, name: part, type: isFile ? 'file' : 'directory', children: isFile ? undefined : [] };
                current.children?.push(child);
            }
            current = child;
        });
    });
    return root;
};