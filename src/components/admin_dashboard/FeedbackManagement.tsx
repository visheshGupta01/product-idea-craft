import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { MessageCircle, User, Calendar, Tag, Filter } from 'lucide-react';
import { getAllFeedbacks, getFeedbackCategories, Feedback } from '@/services/feedbackService';
import { toast } from 'sonner';

const FeedbackManagement: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getFeedbackCategories();
        setCategories(response.categories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setIsLoading(true);
        const response = await getAllFeedbacks(currentPage, selectedCategory || undefined);
        setFeedbacks(response.feedbacks || []);
      } catch (error) {
        console.error('Failed to load feedbacks:', error);
        toast.error('Failed to load feedbacks');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedbacks();
  }, [currentPage, selectedCategory]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Bug Report': 'bg-red-100 text-red-800 border-red-200',
      'Feature Request': 'bg-blue-100 text-blue-800 border-blue-200',
      'UI/UX Feedback': 'bg-purple-100 text-purple-800 border-purple-200',
      'Performance Issues': 'bg-orange-100 text-orange-800 border-orange-200',
      'Tool Accuracy / Output Quality': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Deployment & Integration': 'bg-green-100 text-green-800 border-green-200',
      'General Feedback': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 ml-16 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-16 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback Management</h1>
          <p className="text-muted-foreground">
            Review and manage user feedback submissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{feedbacks.length} Feedbacks</span>
        </div>
      </div>

      <div className="flex items-center gap-4 px-6 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
            <p className="text-muted-foreground text-center">
              When users submit feedback, it will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <Card key={feedback.ID} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{feedback.subject}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{feedback.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(feedback.CreatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getCategoryColor(feedback.category)} border`}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {feedback.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">{feedback.content}</p>
                      <div className="text-xs text-muted-foreground">
                        User ID: {feedback.user_id}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              Page {currentPage}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={feedbacks.length < 10}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;