import type { FileNode } from '@/sidebar/types';

export const flattenStructure = (node: FileNode): FileNode[] => [...(node.type === 'file' ? [node] : []), ...(node.children ? node.children.flatMap(flattenStructure) : [])];