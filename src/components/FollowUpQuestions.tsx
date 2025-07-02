
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Lightbulb, Upload, Mic } from 'lucide-react';
import TextToSpeechPanelComponent, {
  TextToSpeechPanelRef,
} from "@/components/ui/speech-to-text";

interface FollowUpQuestionsProps {
  userIdea: string;
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
  initialAnswers?: Record<string, string>;
}

const FollowUpQuestions = ({ userIdea, onComplete, onBack, initialAnswers = {} }: FollowUpQuestionsProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [isRecording, setIsRecording] = useState<Record<number, boolean>>({});
  const speechRefs = useRef<Record<number, TextToSpeechPanelRef | null>>({});
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const questions = [
    {
      id: 'target_audience',
      question: 'Who is your target audience?',
      placeholder: 'e.g., Small business owners, Students, Healthcare professionals...',
      suggestions: ['Small businesses', 'Students', 'Professionals', 'General consumers']
    },
    {
      id: 'key_features',
      question: 'What are the main features you want?',
      placeholder: 'e.g., User authentication, Payment processing, Real-time chat...',
      suggestions: ['User accounts', 'Payment system', 'Dashboard', 'Mobile-friendly']
    },
    {
      id: 'design_style',
      question: 'What design style do you prefer?',
      placeholder: 'e.g., Modern and minimal, Colorful and playful, Professional and clean...',
      suggestions: ['Modern & minimal', 'Colorful & fun', 'Professional', 'Dark theme']
    },
    {
      id: 'timeline',
      question: 'What\'s your preferred timeline?',
      placeholder: 'e.g., As soon as possible, Within a month, No rush...',
      suggestions: ['ASAP', 'Within 2 weeks', 'Within a month', 'No deadline']
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleSpeechTranscript = (transcript: string, questionIndex: number) => {
    const questionId = questions[questionIndex].id;
    const currentAnswer = answers[questionId] || '';
    const newAnswer = currentAnswer + (currentAnswer ? ' ' : '') + transcript;
    setAnswers(prev => ({
      ...prev,
      [questionId]: newAnswer
    }));
    setIsRecording(prev => ({ ...prev, [questionIndex]: false }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name).join(', ');
      const uploadText = `[Uploaded files: ${fileNames}]`;
      const questionId = questions[questionIndex].id;
      const currentAnswer = answers[questionId] || '';
      const newAnswer = currentAnswer + (currentAnswer ? ' ' : '') + uploadText;
      setAnswers(prev => ({
        ...prev,
        [questionId]: newAnswer
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const currentAnswer = answers[currentQuestion.id] || '';
    const newAnswer = currentAnswer ? `${currentAnswer}, ${suggestion}` : suggestion;
    handleAnswerChange(newAnswer);
  };

  const canProceed = answers[currentQuestion.id]?.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              Let's refine your idea
            </CardTitle>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="relative">
              <Textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="min-h-[120px] text-base resize-none pr-20"
              />

              <div className="absolute top-3 right-3 flex items-center gap-2">
                {/* Upload Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRefs.current[currentQuestionIndex]?.click()}
                  className="h-8 w-8 hover:scale-110 transition-all duration-300"
                  title="Upload files"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                
                {/* Hidden file input */}
                <input
                  ref={(el) => fileInputRefs.current[currentQuestionIndex] = el}
                  type="file"
                  multiple
                  accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
                  onChange={(e) => handleFileUpload(e, currentQuestionIndex)}
                  className="hidden"
                />

                {/* Voice Input with Recording Animation */}
                <div className="relative">
                  {isRecording[currentQuestionIndex] && (
                    <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-pulse">
                      <div className="absolute -inset-1 bg-red-500/30 rounded-full animate-ping"></div>
                    </div>
                  )}
                  <TextToSpeechPanelComponent
                    ref={(el) => speechRefs.current[currentQuestionIndex] = el}
                    onTranscript={(transcript) => handleSpeechTranscript(transcript, currentQuestionIndex)}
                    onInterimTranscript={(transcript) => {
                      setIsRecording(prev => ({ ...prev, [currentQuestionIndex]: !!transcript }));
                    }}
                    className="h-8 w-8 relative z-10"
                  />
                  {isRecording[currentQuestionIndex] && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap animate-bounce">
                      <Mic className="w-3 h-3 inline mr-1" />
                      Recording...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
              {currentQuestion.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-sm hover:bg-primary/10 transition-colors"
                >
                  {suggestion}
                </Button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentQuestionIndex === 0 ? 'Back to Idea' : 'Previous'}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-2"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Continue' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FollowUpQuestions;
