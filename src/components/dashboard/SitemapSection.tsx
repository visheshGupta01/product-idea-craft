import React, { useState, useRef, useEffect } from 'react';
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
  Circle
} from 'lucide-react';

interface SitemapItem {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: any;
  hasSubItems?: boolean;
  isExpanded?: boolean;
}

interface SitemapSectionProps {
  collapsed: boolean;
}

const SitemapSection = ({ collapsed }: SitemapSectionProps) => {
  const [sitemapItems, setSitemapItems] = useState<SitemapItem[]>([
    {
      id: 1,
      title: 'Home',
      status: 'completed',
      icon: Home,
      hasSubItems: true,
      isExpanded: true
    },
    {
      id: 2,
      title: 'Hero Section',
      status: 'completed',
      icon: Grid3X3
    },
    {
      id: 3,
      title: 'Shop Section',
      status: 'completed',
      icon: ShoppingBag
    },
    {
      id: 4,
      title: 'Feature Grid',
      status: 'in-progress',
      icon: Grid3X3
    },
    {
      id: 5,
      title: 'Testimonies',
      status: 'pending',
      icon: MessageSquare
    },
    {
      id: 6,
      title: 'About',
      status: 'pending',
      icon: User,
      hasSubItems: true
    },
    {
      id: 7,
      title: 'Services',
      status: 'pending',
      icon: Briefcase,
      hasSubItems: true
    },
    {
      id: 8,
      title: 'Blogs',
      status: 'pending',
      icon: FileText,
      hasSubItems: true
    },
    {
      id: 9,
      title: 'Contacts',
      status: 'pending',
      icon: Phone,
      hasSubItems: true
    }
  ]);

  const completedItems = sitemapItems.filter(item => item.status === 'completed').length;
  const progress = completedItems / sitemapItems.length * 100;

  const toggleExpanded = (id: number) => {
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
                <p>{Math.round(progress)}% complete</p>
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
                      <h4 className="text-sm font-medium text-sidebar-foreground break-words leading-tight">
                        {item.title}
                      </h4>
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