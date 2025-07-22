import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SitemapData {
  project_name: string;
  project_type: string;
  domain: string;
  description: string;
  tech_stack: {
    frontend: string;
    backend: string;
    database: string;
  };
  pages: Array<{
    name: string;
    description: string;
    frontend_path: string;
    backend_api_path: string;
    components: string[];
  }>;
  database_models: Array<{
    model_name: string;
    fields: Record<string, string>;
    relationships: string[];
  }>;
  backend_api_routes: Array<{
    route: string;
    method: string;
    controller_function: string;
    description: string;
    related_model: string;
  }>;
  source_code_paths: {
    frontend: string;
    backend: string;
    models: string;
    api_routes: string;
    database_config: string;
  };
}

interface SitemapRendererProps {
  data: SitemapData;
}

export const SitemapRenderer: React.FC<SitemapRendererProps> = ({ data }) => {
  return (
    <div className="space-y-6 w-full">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">{data.project_name}</CardTitle>
          <CardDescription>
            <Badge variant="secondary" className="mr-2">{data.project_type}</Badge>
            <Badge variant="outline">{data.domain}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{data.description}</p>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Frontend</h4>
              <Badge variant="default">{data.tech_stack.frontend}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Backend</h4>
              <Badge variant="default">{data.tech_stack.backend}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Database</h4>
              <Badge variant="default">{data.tech_stack.database}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Application Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.pages.map((page, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">{page.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{page.description}</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium text-foreground">Frontend:</span>
                    <code className="ml-2 bg-muted px-1 py-0.5 rounded text-foreground">{page.frontend_path}</code>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">API:</span>
                    <code className="ml-2 bg-muted px-1 py-0.5 rounded text-foreground">{page.backend_api_path}</code>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Components:</span>
                    <div className="mt-1 space-x-1">
                      {page.components.map((component, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{component}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Models */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Database Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.database_models.map((model, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-3">{model.model_name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Fields</h5>
                    <div className="space-y-1">
                      {Object.entries(model.fields).map(([field, type]) => (
                        <div key={field} className="flex justify-between text-xs">
                          <span className="text-foreground">{field}</span>
                          <Badge variant="secondary" className="text-xs">{type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Relationships</h5>
                    <div className="space-y-1">
                      {model.relationships.map((relationship, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs block w-fit">{relationship}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Routes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">API Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.backend_api_routes.map((route, index) => (
              <div key={index} className="border border-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={route.method === 'GET' ? 'default' : route.method === 'POST' ? 'secondary' : 'destructive'} className="text-xs">
                    {route.method}
                  </Badge>
                  <code className="text-sm bg-muted px-2 py-1 rounded text-foreground">{route.route}</code>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{route.description}</p>
                <div className="flex gap-4 text-xs">
                  <span>
                    <span className="font-medium text-foreground">Function:</span>
                    <code className="ml-1 bg-muted px-1 py-0.5 rounded text-foreground">{route.controller_function}</code>
                  </span>
                  <span>
                    <span className="font-medium text-foreground">Model:</span>
                    <Badge variant="outline" className="ml-1 text-xs">{route.related_model}</Badge>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Code Paths */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Project Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {Object.entries(data.source_code_paths).map(([key, path]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-foreground capitalize">{key.replace('_', ' ')}:</span>
                <code className="bg-muted px-2 py-1 rounded text-foreground">{path}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};