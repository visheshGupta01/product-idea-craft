import React from "react";
import { SitemapRenderer } from "./SitemapRenderer";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) {
    return <span>Loading...</span>;
  }

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactElement[] = [];
    let currentIndex = 0;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) {
        i++;
        continue;
      }

      // Headers
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={currentIndex++}
            className="text-2xl font-bold mb-2 mt-3 text-foreground border-b border-border pb-1"
          >
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={currentIndex++}
            className="text-xl font-bold mb-2 mt-3 text-foreground border-b border-border pb-1"
          >
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={currentIndex++}
            className="text-lg font-bold mb-2 mt-3 text-foreground border-b border-border pb-1"
          >
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4
            key={currentIndex++}
            className="text-md font-semibold mb-1 mt-2 text-foreground"
          >
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith("##### ")) {
        elements.push(
          <h5
            key={currentIndex++}
            className="text-sm font-semibold mb-1 mt-2 text-foreground"
          >
            {line.substring(6)}
          </h5>
        );
      } else if (line.startsWith("###### ")) {
        elements.push(
          <h6
            key={currentIndex++}
            className="text-sm font-semibold mb-1 mt-2 text-muted-foreground"
          >
            {line.substring(7)}
          </h6>
        );
      }
      // Horizontal rules
      else if (
        line.trim() === "---" ||
        line.trim() === "***" ||
        line.trim() === "___"
      ) {
        elements.push(
          <hr key={currentIndex++} className="my-3 border-t-2 border-border" />
        );
      }
      // Code blocks (fenced)
      else if (line.startsWith("```")) {
        const language = line.substring(3).trim();
        const codeLines = [];
        let j = i + 1;

        while (j < lines.length && !lines[j].startsWith("```")) {
          codeLines.push(lines[j]);
          j++;
        }

        elements.push(
          <div key={currentIndex++} className="my-4">
            <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
              {language && (
                <div className="bg-primary/20 px-4 py-2 text-sm font-mono text-primary border-b border-primary/30">
                  {language}
                </div>
              )}
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm font-mono text-foreground leading-relaxed">
                  {codeLines.join("\n")}
                </code>
              </pre>
            </div>
          </div>
        );

        i = j; // Skip to end of code block
      }
      // Blockquotes
      else if (line.startsWith("> ")) {
        const quoteLines = [line.substring(2)];
        let j = i + 1;

        while (j < lines.length && lines[j].startsWith("> ")) {
          quoteLines.push(lines[j].substring(2));
          j++;
        }

        elements.push(
          <blockquote
            key={currentIndex++}
            className="border-l-4 border-primary bg-primary/10 pl-4 py-2 my-2 italic text-muted-foreground"
          >
            {quoteLines.map((quoteLine, idx) => (
              <p key={idx} className="mb-1 last:mb-0">
                {processInlineFormatting(quoteLine)}
              </p>
            ))}
          </blockquote>
        );

        i = j - 1; // Skip processed lines
      }
      // Enhanced Lists with proper nesting and indentation
      else if (line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/)) {
        const { listElement, nextIndex } = processNestedList(lines, i);
        elements.push(React.cloneElement(listElement, { key: currentIndex++ }));
        i = nextIndex - 1;
      }
      // Enhanced Tables with better styling
      else if (line.includes("|") && line.split("|").length > 2) {
        const tableLines = [line];
        let j = i + 1;

        while (
          j < lines.length &&
          lines[j].includes("|") &&
          lines[j].split("|").length > 2
        ) {
          tableLines.push(lines[j]);
          j++;
        }

        const rows = tableLines.map((row) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell)
        );

        const hasHeader =
          rows.length > 1 && rows[1].some((cell) => cell.includes("---"));
        const headerRow = hasHeader ? rows[0] : null;
        const dataRows = hasHeader ? rows.slice(2) : rows;

        elements.push(
          <div key={currentIndex++} className="my-6 overflow-x-auto shadow-sm rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border">
              {headerRow && (
                <thead className="bg-gradient-to-r from-primary/10 to-accent/5">
                  <tr>
                    {headerRow.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-3 text-left text-xs font-bold text-primary uppercase tracking-wider border-r border-border last:border-r-0"
                      >
                        {processInlineFormatting(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="bg-background divide-y divide-border">
                {dataRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-muted/50 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-6 py-4 whitespace-nowrap text-sm text-foreground border-r border-border last:border-r-0"
                      >
                        {processInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

        i = j - 1;
      }
      // Regular paragraphs
      else {
        elements.push(
          <p
            key={currentIndex++}
            className="mb-4 leading-relaxed text-foreground"
          >
            {processInlineFormatting(line)}
          </p>
        );
      }

      i++;
    }

    return elements;
  };

  // Enhanced nested list processing
  const processNestedList = (lines: string[], startIndex: number) => {
    const listItems: Array<{
      content: string;
      level: number;
      isOrdered: boolean;
      originalNumber?: string;
      children?: any[];
    }> = [];

    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines
      if (line.match(/^\s*$/)) {
        i++;
        continue;
      }

      const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);

      if (!listMatch) {
        // Check if it's a continuation line (indented but not a list item)
        if (line.match(/^\s{2,}/) && listItems.length > 0) {
          const lastItem = listItems[listItems.length - 1];
          lastItem.content += " " + line.trim();
          i++;
          continue;
        }
        break;
      }

      const indent = listMatch[1];
      const marker = listMatch[2];
      const content = listMatch[3];
      const level = Math.floor(indent.length / 2); // 2 spaces per level
      const isOrdered = marker.match(/\d+\./) !== null;

      listItems.push({
        content,
        level,
        isOrdered,
        originalNumber: isOrdered ? marker.replace(".", "") : undefined,
      });

      i++;
    }

    // Build nested structure
    const buildNestedList = (
      items: typeof listItems,
      currentLevel: number = 0
    ): React.ReactElement => {
      const currentLevelItems = items.filter(
        (item) => item.level === currentLevel
      );
      const isOrdered =
        currentLevelItems.length > 0 && currentLevelItems[0].isOrdered;

      const ListComponent = isOrdered ? "ol" : "ul";
      const listProps =
        isOrdered && currentLevelItems[0]?.originalNumber
          ? { start: parseInt(currentLevelItems[0].originalNumber) || 1 }
          : {};

      return (
        <ListComponent
          className={`my-4 ${isOrdered ? "list-decimal" : "list-disc"} ${
            currentLevel === 0 ? "list-inside" : "list-outside ml-6"
          } space-y-2`}
          {...listProps}
        >
          {currentLevelItems.map((item, idx) => {
            const nextLevelItems = items.filter(
              (nextItem, nextIdx) =>
                nextItem.level === currentLevel + 1 &&
                items.findIndex((i) => i === nextItem) >
                  items.findIndex((i) => i === item) &&
                (idx === currentLevelItems.length - 1 ||
                  items.findIndex((i) => i === nextItem) <
                    items.findIndex((i) => i === currentLevelItems[idx + 1]))
            );

            return (
              <li key={idx} className="text-foreground leading-relaxed">
                {processInlineFormatting(item.content)}
                {nextLevelItems.length > 0 && (
                  <div className="mt-2">
                    {buildNestedList(nextLevelItems, currentLevel + 1)}
                  </div>
                )}
              </li>
            );
          })}
        </ListComponent>
      );
    };

    if (listItems.length === 0) {
      return { listElement: <div />, nextIndex: i };
    }

    return {
      listElement: buildNestedList(listItems),
      nextIndex: i,
    };
  };

  // Process inline formatting (bold, italic, code, links)
  const processInlineFormatting = (text: string) => {
    // Handle inline code first
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted text-foreground px-1 py-0.5 rounded font-mono text-sm">$1</code>'
    );

    // Handle bold
    text = text.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-bold text-foreground">$1</strong>'
    );

    // Handle italic
    text = text.replace(
      /\*([^*]+)\*/g,
      '<em class="italic text-foreground">$1</em>'
    );

    // Handle links
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="underline" style="color: #2998E9;" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Handle strikethrough
    text = text.replace(
      /~~([^~]+)~~/g,
      '<del class="line-through text-muted-foreground">$1</del>'
    );

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

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

  // Check for tool outputs first
  const toolOutputParts = processToolOutput(content);
  
  if (toolOutputParts.length > 1 || (toolOutputParts.length === 1 && toolOutputParts[0].type === 'tool')) {
    // Mixed content with tool outputs
    return (
      <div className="space-y-4">
        {toolOutputParts.map((part, index) => {
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
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {renderMarkdown(part.content)}
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="prose prose-sm max-w-none">
                {renderMarkdown(part.content)}
              </div>
            );
          }
        })}
      </div>
    );
  }

  // Check for sitemap data
  const sitemapMatch = content.match(/__SITEMAP_DATA__(.*?)__SITEMAP_DATA__/s);
  if (sitemapMatch) {
    try {
      const sitemapData = JSON.parse(sitemapMatch[1]);
      const beforeSitemap = content.substring(0, content.indexOf('__SITEMAP_DATA__'));
      const afterSitemap = content.substring(content.lastIndexOf('__SITEMAP_DATA__') + '__SITEMAP_DATA__'.length);
      
      return (
        <div className="space-y-6">
          {beforeSitemap.trim() && (
            <div className="prose prose-sm max-w-none">{renderMarkdown(beforeSitemap.trim())}</div>
          )}
          <SitemapRenderer data={sitemapData} />
          {afterSitemap.trim() && (
            <div className="prose prose-sm max-w-none">{renderMarkdown(afterSitemap.trim())}</div>
          )}
        </div>
      );
    } catch (error) {
      console.error("Error parsing sitemap data:", error);
      // Fall back to regular markdown rendering
    }
  }

  return (
    <div className="prose prose-sm max-w-none">{renderMarkdown(content)}</div>
  );
};