import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Home, User, ShoppingBag, Grid3X3, MessageSquare, FileText, Phone, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { ProjectDetails } from '@/services/projectService';

interface SitemapSectionProps {
  projectDetails: ProjectDetails | undefined;
  collapsed: boolean;
}

const getPageIcon = (pageName: string) => {
  const name = pageName.toLowerCase();
  if (name.includes('home')) return Home;
  if (name.includes('about')) return User;
  if (name.includes('shop') || name.includes('store')) return ShoppingBag;
  if (name.includes('feature') || name.includes('grid')) return Grid3X3;
  if (name.includes('testimonial') || name.includes('review')) return MessageSquare;
  if (name.includes('contact')) return Phone;
  return FileText;
};

const getPageStatus = (index: number, total: number) => {
  // First page is always completed (home)
  if (index === 0) return 'completed';
  // Second and third pages are completed
  if (index === 1 || index === 2) return 'completed';
  // Fourth page is in progress
  if (index === 3) return 'in-progress';
  // Rest are pending
  return 'pending';
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'in-progress':
      return <RefreshCw size={16} className="text-blue-500" />;
    default:
      return <Clock size={16} className="text-muted-foreground" />;
  }
};

export default function SitemapSection({ projectDetails, collapsed }: SitemapSectionProps) {
  // Don't render if no sitemap data
  if (!projectDetails?.sitemap?.pages) {
    return null;
  }

  if (collapsed) {
    return (
      <div className="px-2 py-2">
        <div className="p-2 hover:bg-sidebar-accent rounded-md transition-colors cursor-pointer">
          <FileText size={20} className="text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm font-medium text-sidebar-foreground hover:text-primary transition-colors">
          <div className="flex items-center space-x-2">
            <Home size={16} className="text-pink-500" />
            <span>Home</span>
          </div>
          <ChevronDown size={16} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-3 ml-2">
          {projectDetails.sitemap.pages.map((page, index) => {
            const Icon = getPageIcon(page.name);
            const status = getPageStatus(index, projectDetails.sitemap.pages.length);
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-sidebar-accent/50 rounded-md transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <Icon size={16} className="text-pink-500 flex-shrink-0" />
                  <span className="text-sm text-sidebar-foreground group-hover:text-primary transition-colors">
                    {page.name}
                  </span>
                </div>
                <StatusIcon status={status} />
              </div>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}