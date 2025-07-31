// components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { SitemapRenderer } from "../chat/SitemapRenderer";

interface ContentPart {
  type: 'text' | 'tool';
  content: string;
  toolName?: string;
}

const processToolOutput = (content: string): ContentPart[] => {
  const toolRegex = /\[Tool Output for (lov-[^\]]+)\]:\s*\n([\s\S]*?)(?=\n\[Tool Output for lov-|\n(?!\s)|\n$|$)/g;
  const parts: ContentPart[] = [];
  let lastIndex = 0;
  let match;

  while ((match = toolRegex.exec(content)) !== null) {
    // Add text before this tool output
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index).trim();
      if (textContent) {
        parts.push({ type: 'text', content: textContent });
      }
    }

    // Add the tool output
    parts.push({
      type: 'tool',
      content: match[2].trim(),
      toolName: match[1]
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    const remainingContent = content.slice(lastIndex).trim();
    if (remainingContent) {
      parts.push({ type: 'text', content: remainingContent });
    }
  }

  return parts;
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  // Check for sitemap data
  const sitemapMatch = content.match(/__SITEMAP_DATA__\s*(\{[\s\S]*?\})\s*__SITEMAP_DATA__/);
  
  if (sitemapMatch) {
    try {
      const sitemapData = JSON.parse(sitemapMatch[1]);
      const beforeSitemap = content.substring(0, sitemapMatch.index).trim();
      const afterSitemap = content.substring(sitemapMatch.index! + sitemapMatch[0].length).trim();

      return (
        <div className="prose prose-sm max-w-none">
          {beforeSitemap && <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{beforeSitemap}</ReactMarkdown>}
          <SitemapRenderer data={sitemapData} />
          {afterSitemap && <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{afterSitemap}</ReactMarkdown>}
        </div>
      );
    } catch (error) {
      console.error('Error parsing sitemap data:', error);
    }
  }

  // Process tool outputs
  const contentParts = processToolOutput(content);

  // If no tool outputs found, render as normal markdown
  if (contentParts.length === 0 || (contentParts.length === 1 && contentParts[0].type === 'text')) {
    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
      </div>
    );
  }

  // Render mixed content with tool outputs
  return (
    <div className="prose prose-sm max-w-none">
      {contentParts.map((part, index) => {
        if (part.type === 'tool') {
          return (
            <div key={index} className="my-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                  🔧 {part.toolName}
                </span>
              </div>
              <div className="text-sm">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{part.content}</ReactMarkdown>
              </div>
            </div>
          );
        } else {
          return (
            <div key={index}>
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{part.content}</ReactMarkdown>
            </div>
          );
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;
