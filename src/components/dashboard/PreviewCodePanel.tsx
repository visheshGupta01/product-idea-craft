
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Code, Maximize2, Minimize2 } from 'lucide-react';

const PreviewCodePanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockPreview = `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <header class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Your App Preview
          </h1>
          <p class="text-xl text-gray-600">
            This is how your app will look
          </p>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-xl shadow-sm border">
            <h3 class="font-semibold mb-2">Feature 1</h3>
            <p class="text-gray-600">Description of your first feature</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border">
            <h3 class="font-semibold mb-2">Feature 2</h3>
            <p class="text-gray-600">Description of your second feature</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border">
            <h3 class="font-semibold mb-2">Feature 3</h3>
            <p class="text-gray-600">Description of your third feature</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const mockCode = `import React from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your App Preview
          </h1>
          <p className="text-xl text-gray-600">
            This is how your app will look
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;`;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold">Preview & Code</h3>
          <Badge variant="secondary" className="text-xs">
            Live Preview
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Code</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="flex-1 m-0 p-4 overflow-auto">
            <div className="w-full h-full border border-border rounded-lg overflow-hidden bg-white">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <script src="https://cdn.tailwindcss.com"></script>
                    </head>
                    <body>
                      ${mockPreview}
                    </body>
                  </html>
                `}
                className="w-full h-full border-0"
                title="App Preview"
              />
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 m-0 p-4 overflow-auto">
            <div className="bg-muted rounded-lg p-4 h-full overflow-auto">
              <pre className="text-sm text-foreground">
                <code>{mockCode}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PreviewCodePanel;
