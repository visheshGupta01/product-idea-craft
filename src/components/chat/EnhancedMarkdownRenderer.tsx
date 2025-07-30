import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { SitemapRenderer } from "./SitemapRenderer";
import "highlight.js/styles/github.css";

interface EnhancedMarkdownRendererProps {
  content: string;
}

export const EnhancedMarkdownRenderer: React.FC<EnhancedMarkdownRendererProps> = ({ content }) => {
  // Check for sitemap data
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

  // Regular markdown rendering
  return (
    <div className="prose prose-sm max-w-none">
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
};