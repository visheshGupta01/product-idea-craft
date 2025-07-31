import React from 'react';
import { ToolOutput } from '../../types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ToolOutputRendererProps {
  toolOutputs: ToolOutput[];
}

export const ToolOutputRenderer: React.FC<ToolOutputRendererProps> = ({ toolOutputs }) => {
  const getToolIcon = (toolName: string) => {
    if (toolName.includes('write')) return '✏️';
    if (toolName.includes('read') || toolName.includes('view')) return '👁️';
    if (toolName.includes('search')) return '🔍';
    if (toolName.includes('delete')) return '🗑️';
    if (toolName.includes('rename')) return '📝';
    if (toolName.includes('dependency')) return '📦';
    if (toolName.includes('generate')) return '🎨';
    if (toolName.includes('edit')) return '✂️';
    return '🔧';
  };

  const getStatusColor = (status: ToolOutput['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20';
      case 'error':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20';
      case 'running':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20';
      default:
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  const getStatusTextColor = (status: ToolOutput['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-700 dark:text-green-300';
      case 'error':
        return 'text-red-700 dark:text-red-300';
      case 'running':
        return 'text-yellow-700 dark:text-yellow-300';
      default:
        return 'text-blue-700 dark:text-blue-300';
    }
  };

  if (!toolOutputs || toolOutputs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-4">
      {toolOutputs.map((toolOutput, index) => (
        <div 
          key={index} 
          className={`border rounded-lg p-4 ${getStatusColor(toolOutput.status)}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{getToolIcon(toolOutput.toolName)}</span>
            <span className={`text-sm font-medium ${getStatusTextColor(toolOutput.status)}`}>
              {toolOutput.toolName}
            </span>
            {toolOutput.status === 'running' && (
              <div className="ml-auto">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              </div>
            )}
          </div>
          
          {toolOutput.content && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <MarkdownRenderer content={toolOutput.content} />
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-2">
            {toolOutput.timestamp.toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
};