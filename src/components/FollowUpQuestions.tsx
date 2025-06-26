
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import TextToSpeechPanelComponent, { TextToSpeechPanelRef } from '@/components/ui/speech-to-text';

interface FollowUpQuestionsProps {
  userIdea: string;
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const FollowUpQuestions = ({ userIdea, onComplete, onBack }: FollowUpQuestionsProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  const speechRef = useRef<TextToSpeechPanelRef>(null);

  const questions = [
    {
      id: 'target_audience',
      title: 'Who is your target audience?',
      placeholder: 'Describe who would use your app... (Press Shift+Enter to continue)'
    },
    {
      id: 'key_features',
      title: 'What are the 3 most important features?',
      placeholder: 'List the core features that are essential for your app... (Press Shift+Enter to continue)'
    },
    {
      id: 'monetization',
      title: 'How do you plan to monetize this?',
      placeholder: 'Describe your revenue model... (Press Shift+Enter to continue)'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stopSpeech = () => {
    speechRef.current?.stopListening();
  };

  const handleNext = () => {
    const currentAnswer = answers[questions[currentQuestion].id] || '';
    if (!currentAnswer.trim()) return;

    stopSpeech();

    if (currentQuestion < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    stopSpeech();

    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onBack();
    }
  };

  const updateAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value
    });
  };

  const handleSpeechTranscript = (transcript: string) => {
    const currentAnswer = answers[questions[currentQuestion].id] || '';
    updateAnswer(currentAnswer + (currentAnswer ? ' ' : '') + transcript);
    setLiveTranscript('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentAnswer = answers[questions[currentQuestion].id] || '';
    if (e.key === 'Enter' && e.shiftKey && currentAnswer.trim()) {
      e.preventDefault();
      handleNext();
    }
  };

  const currentAnswer = answers[questions[currentQuestion].id] || '';
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-6">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      
      <Card 
        className={`relative z-10 w-full max-w-2xl transition-all duration-800 ${
          isVisible ? 'animate-scale-in opacity-100' : 'opacity-0 scale-95'
        }`}
      >
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="outline" className="text-sm">
              {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold">
            {questions[currentQuestion].title}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Help us understand your vision better
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  index < currentQuestion
                    ? 'bg-green-500'
                    : index === currentQuestion
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div 
            className={`transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="relative">
              <Textarea
                placeholder={questions[currentQuestion].placeholder}
                value={currentAnswer + (liveTranscript ? ' ' + liveTranscript : '')}
                onChange={(e) => updateAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[120px] text-base resize-none border-2 focus:border-primary/50 rounded-xl transition-all duration-300 focus:shadow-lg focus:shadow-primary/10 pr-12"
              />
              <div className="absolute top-3 right-3">
                <TextToSpeechPanelComponent
                  ref={speechRef}
                  onTranscript={handleSpeechTranscript}
                  onInterimTranscript={setLiveTranscript}
                  className="h-8 w-8"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentQuestion === 0 ? 'Back to Idea' : 'Previous'}</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!currentAnswer.trim()}
              className="flex items-center space-x-2 group"
            >
              <span>{isLastQuestion ? 'Complete Setup' : 'Next Question'}</span>
              {isLastQuestion ? (
                <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Your idea:</strong> {userIdea.substring(0, 100)}...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUpQuestions;
