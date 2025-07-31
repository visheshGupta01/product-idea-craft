import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { SitemapRenderer } from "./SitemapRenderer";
import "highlight.js/styles/github.css";

interface EnhancedMarkdownRendererProps {
  content: string;
}

export const EnhancedMarkdownRenderer: React.FC<EnhancedMarkdownRendererProps> = ({ content }) => {
  // Process tool output sections first
  const processToolOutput = (text: string) => {
    // Match tool output sections like [Tool Output for lov-*]:
    const toolOutputRegex = /\[Tool Output for ([^\]]+)\]:\s*([\s\S]*?)(?=\[Tool Output for|\[Tool Use Started\]|$)/g;
    
    const parts: Array<{ type: 'text' | 'tool'; content: string; toolName?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = toolOutputRegex.exec(text)) !== null) {
      // Add text before tool output
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index).trim();
        if (beforeText) {
          parts.push({ type: 'text', content: beforeText });
        }
      }

      // Add tool output
      const toolName = match[1];
      const toolContent = match[2].trim();
      if (toolContent) {
        parts.push({ type: 'tool', content: toolContent, toolName });
      }

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

  // Check for sitemap data first
  const sitemapMatch = content.match(/__SITEMAP_DATA__(.*?)__SITEMAP_DATA__/s);
  
  if (sitemapMatch) {
    try {
      const sitemapDataString = sitemapMatch[1].trim();
      const sitemapData = JSON.parse(sitemapDataString);
      
      // Split content around sitemap data
      const beforeSitemap = content.substring(0, sitemapMatch.index);
      const afterSitemap = content.substring(sitemapMatch.index! + sitemapMatch[0].length);
      
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {beforeSitemap && (
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {beforeSitemap}
            </ReactMarkdown>
          )}
          
          <div className="my-4">
            <SitemapRenderer data={sitemapData} />
          </div>
          
          {afterSitemap && (
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {afterSitemap}
            </ReactMarkdown>
          )}
        </div>
      );
    } catch (error) {
      console.error("Failed to parse sitemap data:", error);
      // Fallback to regular markdown rendering
    }
  }

  // Process content for tool outputs
  const contentParts = processToolOutput(content);

  if (contentParts.length === 1 && contentParts[0].type === 'text') {
    // No tool outputs found, render as regular markdown
    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown 
          rehypePlugins={[rehypeHighlight]}
          components={{
            // Custom components for better styling
            code: ({ className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !className;
              return !isInline && match ? (
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto border">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 text-left font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 dark:border-gray-600 p-2">
                {children}
              </td>
            ),
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-3 space-y-1 text-gray-800 dark:text-gray-200">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-800 dark:text-gray-200">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-800 dark:text-gray-200">
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900 dark:text-gray-100">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-800 dark:text-gray-200">
                {children}
              </em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // Render mixed content with tool outputs
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert space-y-4">
      {contentParts.map((part, index) => {
        if (part.type === 'tool') {
          return (
            <div key={index} className="not-prose bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                  🔧 {part.toolName}
                </span>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown 
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !className;
                      return !isInline && match ? (
                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto border">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {part.content}
                </ReactMarkdown>
              </div>
            </div>
          );
        } else {
          return (
            <div key={index}>
              <ReactMarkdown 
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Same components as above for consistency
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !className;
                    return !isInline && match ? (
                      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto border">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 dark:border-gray-600 p-2">
                      {children}
                    </td>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1 text-gray-800 dark:text-gray-200">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-800 dark:text-gray-200">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-800 dark:text-gray-200">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-800 dark:text-gray-200">
                      {children}
                    </em>
                  ),
                }}
              >
                {part.content}
              </ReactMarkdown>
            </div>
          );
        }
      })}
    </div>
  );
};