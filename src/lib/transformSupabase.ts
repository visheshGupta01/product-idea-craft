import type { FileNode } from '@/components/dashboard/FileExplorer';

export function buildFileTreeFromPathsWithFullPaths(
  files: { relativePath: string; fullPath: string }[]
): FileNode[] {
  const root: Record<string, any> = {};

  for (const { relativePath, fullPath } of files) {
    const parts = relativePath.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isFile = i === parts.length - 1;

      if (!current[name]) {
        current[name] = {
          name,
          type: isFile ? 'file' : 'folder',
          path: isFile ? fullPath : relativePath.split('/').slice(0, i + 1).join('/'),
          ...(isFile ? {} : { children: {} })
        };
      }

      if (!isFile) current = current[name].children;
    }
  }

  const convertToTree = (node: any): FileNode[] =>
    Object.values(node).map((entry: any) => ({
      name: entry.name,
      type: entry.type,
      path: entry.path, // this is fullPath for files
      ...(entry.type === 'folder'
        ? { children: convertToTree(entry.children) }
        : {})
    }));

  return convertToTree(root);
}
