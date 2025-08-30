import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Home, 
  ShoppingBag, 
  Grid3X3, 
  MessageSquare, 
  User, 
  Briefcase, 
  FileText, 
  Phone,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
  Circle,
  Globe,
  Database,
  Code
} from 'lucide-react';

interface SitemapItem {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: any;
  hasSubItems?: boolean;
  isExpanded?: boolean;
  description?: string;
}

interface SitemapData {
  project_name?: string;
  project_type?: string;
  domain?: string;
  description?: string;
  tech_stack?: {
    frontend?: string;
    backend?: string;
    database?: string;
  };
  pages?: Array<{
    name: string;
    description: string;
    frontend_path?: string;
    backend_api_path?: string;
    components?: string[];
  }>;
  database_models?: any[];
  backend_api_routes?: any[];
}

interface SitemapSectionProps {
  collapsed: boolean;
  sitemapData?: SitemapData;
}

const SitemapSection = ({ collapsed, sitemapData }: SitemapSectionProps) => {
  const [sitemapItems, setSitemapItems] = useState<SitemapItem[]>([]);

  // Transform sitemap data into component format
  useEffect(() => {
    if (!sitemapData || !sitemapData.pages) {
      setSitemapItems([]);
      return;
    }

    const getPageIcon = (pageName: string) => {
      const name = pageName.toLowerCase();
      if (name.includes('home') || name.includes('landing')) return Home;
      if (name.includes('about')) return User;
      if (name.includes('contact')) return Phone;
      if (name.includes('service')) return Briefcase;
      if (name.includes('blog') || name.includes('news')) return FileText;
      if (name.includes('shop') || name.includes('product')) return ShoppingBag;
      if (name.includes('portfolio') || name.includes('work')) return Grid3X3;
      if (name.includes('testimonial') || name.includes('review')) return MessageSquare;
      return Globe;
    };

    const transformedItems: SitemapItem[] = sitemapData.pages.map((page, index) => ({
      id: `page-${index}`,
      title: page.name,
      status: 'pending' as const, // Default status since API doesn't provide this
      icon: getPageIcon(page.name),
      hasSubItems: page.components && page.components.length > 0,
      isExpanded: false,
      description: page.description
    }));

    setSitemapItems(transformedItems);
  }, [sitemapData]);

  // If no sitemap data, don't render anything
  if (!sitemapData || !sitemapData.pages || sitemapData.pages.length === 0) {
    return null;
  }

  const completedItems = sitemapItems.filter(item => item.status === 'completed').length;
  const progress = sitemapItems.length > 0 ? (completedItems / sitemapItems.length * 100) : 0;

  const toggleExpanded = (id: string) => {
    setSitemapItems(items => 
      items.map(item => 
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'in-progress':
        return <RotateCcw className="h-3 w-3 text-blue-500" />;
      default:
        return <Circle className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (collapsed) return null;
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 px-1 py-0">✓</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 px-1 py-0">⟳</Badge>;
      default:
        return null;
    }
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-4 space-y-2">
        {sitemapItems.slice(0, 6).map(item => {
          const ItemIcon = item.icon;
          return (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ItemIcon className={`h-4 w-4 ${
                        item.status === 'completed' ? 'text-green-500' : 
                        item.status === 'in-progress' ? 'text-blue-500' : 
                        'text-gray-400'
                      }`} />
                    </Button>
                    {getStatusIcon(item.status) && (
                      <div className="absolute -top-1 -right-1">
                        {getStatusIcon(item.status)}
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.status.replace('-', ' ')}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Project Info */}
      {sitemapData.project_name && (
        <div className="p-3 border-b border-sidebar-border">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-sidebar-foreground">{sitemapData.project_name}</h3>
            {sitemapData.project_type && (
              <p className="text-xs text-muted-foreground">{sitemapData.project_type}</p>
            )}
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <div className="p-3 border-b border-sidebar-border">
        <div className="space-y-2 bg-sidebar-accent/20 rounded-lg p-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{Math.round(progress)}% complete ({completedItems}/{sitemapItems.length})</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Pages/Sitemap List */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {sitemapItems.map(item => {
              const ItemIcon = item.icon;
              
              return (
                <div key={item.id} className="border border-sidebar-border rounded-md p-2 bg-sidebar-accent/10 hover:bg-sidebar-accent/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        {item.hasSubItems && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleExpanded(item.id)} 
                            className="h-4 w-4 p-0"
                          >
                            {item.isExpanded ? 
                              <ChevronDown className="h-3 w-3" /> : 
                              <ChevronRight className="h-3 w-3" />
                            }
                          </Button>
                        )}
                        <ItemIcon className={`h-3 w-3 ${
                          item.status === 'completed' ? 'text-green-500' : 
                          item.status === 'in-progress' ? 'text-blue-500' : 
                          'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-sidebar-foreground break-words leading-tight">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2 flex items-center space-x-1">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SitemapSection;