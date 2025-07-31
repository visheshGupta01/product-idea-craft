// components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { SitemapRenderer } from "../chat/SitemapRenderer";

const MarkdownRenderer = ({ content }: { content: string }) => {
  // Process tool outputs
  const processToolOutput = (text: string) => {
    const toolOutputRegex = /\[Tool Output for (lov-[^:]+)\]:\s*([\s\S]*?)(?=\n\[Tool Output for |$)/g;
    const parts: Array<{ type: 'text' | 'tool'; content: string; toolName?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = toolOutputRegex.exec(text)) !== null) {
      // Add text before this tool output
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index).trim();
        if (beforeText) {
          parts.push({ type: 'text', content: beforeText });
        }
      }

      // Add tool output
      const toolName = match[1];
      const toolContent = match[2].trim();
      parts.push({ type: 'tool', content: toolContent, toolName });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex).trim();
      if (remainingText) {
        parts.push({ type: 'text', content: remainingText });
      }
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  // Check for sitemap data
  const sitemapMatch = content.match(/__SITEMAP_DATA__\s*({[\s\S]*?})\s*__SITEMAP_DATA__/);
  
  if (sitemapMatch) {
    try {
      const sitemapData = JSON.parse(sitemapMatch[1]);
      const beforeSitemap = content.substring(0, sitemapMatch.index).trim();
      const afterSitemap = content.substring(sitemapMatch.index! + sitemapMatch[0].length).trim();

      return (
        <div className="space-y-4">
          {beforeSitemap && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{beforeSitemap}</ReactMarkdown>
            </div>
          )}
          <SitemapRenderer data={sitemapData} />
          {afterSitemap && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{afterSitemap}</ReactMarkdown>
            </div>
          )}
        </div>
      );
    } catch (error) {
      console.error('Error parsing sitemap data:', error);
    }
  }

  const parts = processToolOutput(content);

  if (parts.length === 1 && parts[0].type === 'text') {
    // No tool outputs, render normally
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
      </div>
    );
  }

  // Mixed content with tool outputs
  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.type === 'tool') {
          const getToolIcon = (toolName: string) => {
            if (toolName.includes('write')) return '✏️';
            if (toolName.includes('read') || toolName.includes('view')) return '👁️';
            if (toolName.includes('search')) return '🔍';
            if (toolName.includes('delete')) return '🗑️';
            if (toolName.includes('rename')) return '📝';
            if (toolName.includes('dependency')) return '📦';
            return '🔧';
          };

          return (
            <div key={index} className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">{getToolIcon(part.toolName!)}</span>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {part.toolName}
                </span>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-800 prose-pre:text-gray-100">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{part.content}</ReactMarkdown>
              </div>
            </div>
          );
        } else {
          return (
            <div key={index} className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{part.content}</ReactMarkdown>
            </div>
          );
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;
