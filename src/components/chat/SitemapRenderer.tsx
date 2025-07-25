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
    <div className="space-y-4 w-full text-black">
      {/* Project Overview */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-black">{data.project_name}</CardTitle>
          <CardDescription className="text-gray-600">
            <Badge variant="secondary" className="mr-2 bg-blue-100 text-blue-800 border-blue-200">{data.project_type}</Badge>
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">{data.domain}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-black leading-relaxed text-sm">{data.description}</p>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <h4 className="font-medium text-black mb-2 text-sm">Frontend</h4>
              <Badge variant="default" className="bg-blue-500 text-white">{data.tech_stack.frontend}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-black mb-2 text-sm">Backend</h4>
              <Badge variant="default" className="bg-green-500 text-white">{data.tech_stack.backend}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-black mb-2 text-sm">Database</h4>
              <Badge variant="default" className="bg-purple-500 text-white">{data.tech_stack.database}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">Application Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.pages.map((page, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <h4 className="font-medium text-black mb-2 text-sm">{page.name}</h4>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{page.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-black">Frontend:</span>
                    <code className="bg-gray-200 px-2 py-1 rounded text-black text-xs break-all">{page.frontend_path}</code>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-black">API:</span>
                    <code className="bg-gray-200 px-2 py-1 rounded text-black text-xs break-all">{page.backend_api_path}</code>
                  </div>
                  <div>
                    <span className="font-medium text-black">Components:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {page.components.map((component, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">{component}</Badge>
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
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">Database Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.database_models.map((model, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <h4 className="font-medium text-black mb-3 text-sm">{model.model_name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-black mb-2">Fields</h5>
                    <div className="space-y-1">
                      {Object.entries(model.fields).map(([field, type]) => (
                        <div key={field} className="flex justify-between text-xs items-center">
                          <span className="text-black">{field}</span>
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200">{type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-black mb-2">Relationships</h5>
                    <div className="space-y-1">
                      {model.relationships.map((relationship, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs block w-fit bg-white text-gray-700 border-gray-300">{relationship}</Badge>
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
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">API Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.backend_api_routes.map((route, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant={route.method === 'GET' ? 'default' : route.method === 'POST' ? 'secondary' : 'destructive'} 
                         className={`text-xs ${
                           route.method === 'GET' ? 'bg-green-500 text-white' : 
                           route.method === 'POST' ? 'bg-blue-500 text-white' : 
                           'bg-red-500 text-white'
                         }`}>
                    {route.method}
                  </Badge>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded text-black break-all">{route.route}</code>
                </div>
                <p className="text-xs text-gray-600 mb-2 leading-relaxed">{route.description}</p>
                <div className="flex gap-4 text-xs flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-black">Function:</span>
                    <code className="bg-gray-200 px-1 py-0.5 rounded text-black">{route.controller_function}</code>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-black">Model:</span>
                    <Badge variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">{route.related_model}</Badge>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Code Paths */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">Project Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {Object.entries(data.source_code_paths).map(([key, path]) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="font-medium text-black capitalize">{key.replace('_', ' ')}:</span>
                <code className="bg-gray-200 px-2 py-1 rounded text-black break-all">{path}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};