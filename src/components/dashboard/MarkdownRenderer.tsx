// components/MarkdownRenderer.tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { SitemapRenderer } from "../chat/SitemapRenderer";

const MarkdownRenderer = ({ content }: { content: string }) => {
  // Process tool outputs and integrate seamlessly into content
  const processToolOutput = (text: string) => {
    // Remove tool output markers and integrate content seamlessly
    const cleanedText = text.replace(
      /\[Tool Output for lov-[^:]+\]:\s*/g,
      ''
    );
    return cleanedText;
  };

  // Clean tool outputs and treat them as regular content
  const cleanedContent = processToolOutput(content);

  // Check for sitemap data
  const sitemapMatch = cleanedContent.match(/__SITEMAP_DATA__\s*({[\s\S]*?})\s*__SITEMAP_DATA__/);
  
  if (sitemapMatch) {
    try {
      const sitemapData = JSON.parse(sitemapMatch[1]);
      const beforeSitemap = cleanedContent.substring(0, sitemapMatch.index).trim();
      const afterSitemap = cleanedContent.substring(sitemapMatch.index! + sitemapMatch[0].length).trim();

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

  // Render all content as seamless markdown
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{cleanedContent}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
