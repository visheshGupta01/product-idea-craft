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
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown 
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom components for better styling
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className;
            return !isInline && match ? (
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted p-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border p-2">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};