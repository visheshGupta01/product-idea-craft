import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchSharedChat, ShareChatResponse } from '@/services/shareService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { SitemapRenderer } from '@/components/chat/SitemapRenderer';
import PreviewCodePanel from '@/components/dashboard/PreviewCodePanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const SharedChat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [chatData, setChatData] = useState<ShareChatResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sitemapOpen, setSitemapOpen] = useState(false);
  
  const chatId = searchParams.get('chat');
  console.log("Chat ID:", chatId);
  // const token = searchParams.get('token');

  useEffect(() => {
    const loadSharedChat = async () => {
      if (!chatId) {
        toast.error('Invalid share link');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchSharedChat(chatId);
        console.log("Fetched Chat Data:", data);
        setChatData(data);
      } catch (error) {
        console.error('Failed to load shared chat:', error);
        toast.error('Failed to load shared chat');
      } finally {
        setLoading(false);
      }
    };

    loadSharedChat();
  }, [chatId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Chat Not Found</h2>
            <p className="text-muted-foreground">The shared chat link is invalid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{chatData.title}</h1>
              <p className="text-muted-foreground">Shared Chat</p>
            </div>
            <div className="flex items-center gap-2">
              {chatData.github_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={chatData.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
              {chatData.vercel_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={chatData.vercel_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live App
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-80px)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Chat Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4 max-w-4xl">
                  {chatData.response.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={{
                        id: message.id.toString(),
                        content: message.msg,
                        type: message.role,
                        timestamp: new Date(message.created_at),
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Sitemap Section */}
              {chatData.sitemap && (
                <div className="border-t p-4 flex-shrink-0">
                  <Collapsible open={sitemapOpen} onOpenChange={setSitemapOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                        <span className="text-lg font-semibold">Project Structure</span>
                        {sitemapOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="max-h-60 overflow-y-auto">
                        <SitemapRenderer data={chatData.sitemap} />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <PreviewCodePanel 
              previewUrl={chatData.project_url}
              sessionId={undefined}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default SharedChat;