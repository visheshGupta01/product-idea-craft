import React from "react";
import { SitemapRenderer } from "./SitemapRenderer";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) {
    return <span>Loading...</span>;
  }

  // // Debug logging
  // console.log("MarkdownRenderer received content:", content.substring(0, 500));
  // console.log("Content contains tool output:", content.includes('[Tool Output'));
  // console.log("Content length:", content.length);

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
            className="text-2xl font-bold mb-2 mt-3 text-black border-b border-border pb-1"
          >
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={currentIndex++}
            className="text-xl font-bold mb-2 mt-3 text-black border-b border-border pb-1"
          >
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={currentIndex++}
            className="text-lg font-bold mb-2 mt-3 text-black border-b border-border pb-1"
          >
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4
            key={currentIndex++}
            className="text-md font-semibold mb-1 mt-2 text-black"
          >
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith("##### ")) {
        elements.push(
          <h5
            key={currentIndex++}
            className="text-sm font-semibold mb-1 mt-2 text-black"
          >
            {line.substring(6)}
          </h5>
        );
      } else if (line.startsWith("###### ")) {
        elements.push(
          <h6
            key={currentIndex++}
            className="text-sm font-semibold mb-1 mt-2 text-muted-black"
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
              <pre className="p-6 overflow-x-auto max-w-full">
                <code className="text-sm font-mono text-black leading-relaxed break-words whitespace-pre-wrap">
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
            className="border-l-4 border-primary bg-primary/10 pl-4 py-2 my-2 italic text-muted-black"
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
         <div
           key={currentIndex++}
           className="my-6 w-full max-w-full overflow-hidden"
         >
           <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
             <table className="w-full text-sm text-left text-black border-collapse min-w-max">
               {headerRow && (
                 <thead className="bg-primary text-white">
                   <tr>
                     {headerRow.map((header, idx) => (
                       <th
                         key={idx}
                         className="px-3 py-2 font-semibold text-xs uppercase tracking-wider border border-border whitespace-nowrap"
                       >
                         {processInlineFormatting(header)}
                       </th>
                     ))}
                   </tr>
                 </thead>
               )}
               <tbody className="bg-white divide-y divide-border">
                 {dataRows.map((row, rowIdx) => (
                   <tr
                     key={rowIdx}
                     className="hover:bg-accent/10 transition-colors duration-200"
                   >
                     {row.map((cell, cellIdx) => (
                       <td
                         key={cellIdx}
                         className="px-3 py-2 border border-border text-xs max-w-[200px] overflow-hidden"
                       >
                         <div className="truncate" title={cell}>
                           {processInlineFormatting(cell)}
                         </div>
                       </td>
                     ))}
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       );

        i = j - 1;
      }
      // Regular paragraphs
      else {
        elements.push(
          <p
            key={currentIndex++}
            className="leading-relaxed text-black"
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
          } space-y-2 text-black marker:text-black`}
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
              <li key={idx} className="text-black leading-relaxed">
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
      '<code class="bg-muted text-black px-1 py-0.5 rounded font-mono text-sm">$1</code>'
    );

    // Handle bold
    text = text.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-bold text-black">$1</strong>'
    );

    // Handle italic
    text = text.replace(
      /\*([^*]+)\*/g,
      '<em class="italic text-black">$1</em>'
    );

    // Handle links
text = text.replace(
  /\[([^\]]+)\]\(([^)]+)\)/g,
  '<a href="$2" class="underline" style="color: #2998E9;" target="_blank" rel="noopener noreferrer">$1</a>'
);


    // Handle strikethrough
    text = text.replace(
      /~~([^~]+)~~/g,
      '<del class="line-through text-muted-black">$1</del>'
    );

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  // Process tool outputs and integrate seamlessly into content
const processToolOutput = (text: string) => {
  return text.replace(
    /\[Tool Output for ([^\]]+)\]:\s*([\s\S]*?)(?=\n\S|\Z)/g,
    (match, toolName, toolOutput) => {
      try {
        // If it looks like JSON and is a sitemap tool
        if (toolName.startsWith("sitemap")) {
          const json = JSON.parse(toolOutput);
          return `\n__SITEMAP_DATA__${JSON.stringify(json)}__SITEMAP_DATA__\n`;
        }

        // If it's a quoted markdown string
        if (toolOutput.trim().startsWith('"')) {
          const markdown = JSON.parse(toolOutput);
          return `\n${markdown}\n`;
        }

        // If it's unquoted markdown
        return `\n${toolOutput}\n`;
      } catch (e) {
        console.error(`Failed to parse tool output for "${toolName}":`, e);
        return "";
      }
    }
  );
};



  // Clean tool outputs and treat them as regular content
  const cleanedContent = processToolOutput(content);

  // Check for sitemap data
  const sitemapMatch = cleanedContent.match(/__SITEMAP_DATA__(.*?)__SITEMAP_DATA__/s);
  if (sitemapMatch) {
    try {
      const sitemapData = JSON.parse(sitemapMatch[1]);
      const beforeSitemap = cleanedContent.substring(0, cleanedContent.indexOf('__SITEMAP_DATA__'));
      const afterSitemap = cleanedContent.substring(cleanedContent.lastIndexOf('__SITEMAP_DATA__') + '__SITEMAP_DATA__'.length);
      
      // Check if sitemap has meaningful content
      const hasPages = sitemapData.pages && sitemapData.pages.length > 0;
      
      return (
        <div className="space-y-6">
          {beforeSitemap.trim() && (
            <div className="prose prose-sm max-w-none">{renderMarkdown(beforeSitemap.trim())}</div>
          )}
          {hasPages && <SitemapRenderer data={sitemapData} />}
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
    <div className="prose prose-sm max-w-none overflow-hidden break-words w-full">{renderMarkdown(cleanedContent)}</div>
  );
};