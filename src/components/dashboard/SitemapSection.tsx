import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Home,
  User,
  ShoppingBag,
  Grid3X3,
  MessageSquare,
  FileText,
  Phone,
  CheckCircle,
  Clock,
  RefreshCw,
  Diamond,
} from "lucide-react";
import { ProjectDetails } from "@/services/projectService";

interface SitemapSectionProps {
  projectDetails: ProjectDetails | undefined;
  collapsed: boolean;
}

const getPageIcon = (pageName: string) => {
  const name = pageName.toLowerCase();
  if (name.includes("home")) return Home;
  if (name.includes("about")) return User;
  if (name.includes("shop") || name.includes("store")) return ShoppingBag;
  if (name.includes("feature") || name.includes("grid")) return Grid3X3;
  if (name.includes("testimonial") || name.includes("review"))
    return MessageSquare;
  if (name.includes("contact")) return Phone;
  return FileText;
};

const getPageStatus = (index: number, total: number) => {
  // First page is always completed (home)
  if (index === 0) return "completed";
  // Second and third pages are completed
  if (index === 1 || index === 2) return "completed";
  // Fourth page is in progress
  if (index === 3) return "in-progress";
  // Rest are pending
  return "pending";
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "completed":
      return <CheckCircle size={16} className="text-green-500" />;
    case "in-progress":
      return <RefreshCw size={16} className="text-blue-500" />;
    default:
      return <Clock size={16} className="text-muted-foreground" />;
  }
};

export default function SitemapSection({
  projectDetails,
  collapsed,
}: SitemapSectionProps) {
  const pages = projectDetails?.sitemap?.pages ?? [];

  //console.log("Rendering SitemapSection, pages:", pages);

  if (pages.length === 0) {
    //console.log("No sitemap pages available.");
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
    <div className="px-4 py-2 space-y-2 overflow-y-auto">
      {pages.map((page, index) => {
        const Icon = getPageIcon(page.name);
        const status = getPageStatus(index, pages.length);

        return (
          <Collapsible key={page.name ?? index} defaultOpen={index === 0}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left text-sm font-medium text-sidebar-foreground hover:text-primary transition-colors p-2 hover:bg-sidebar-accent/50 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon size={16} className="text-pink-500" />
                <span>{page.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChevronDown
                  size={14}
                  className="transition-transform data-[state=open]:rotate-180"
                />
              </div>
            </CollapsibleTrigger>
            {Array.isArray(page.components) && page.components.length > 0 && (
              <CollapsibleContent className="space-y-1 mt-2 ml-6">
                {page.components.map((component: string, compIndex: number) => (
                  <div
                    key={compIndex}
                    className="flex items-center space-x-2 p-1 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
                  >
                    <Diamond
                      size={12}
                      className="text-muted-foreground text-pink-400"
                    />
                    <span>{component}</span>
                  </div>
                ))}
              </CollapsibleContent>
            )}
          </Collapsible>
        );
      })}
    </div>
  );
}
