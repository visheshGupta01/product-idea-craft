
import React, { useState } from 'react';
import IdeaSubmissionScreen from '../components/IdeaSubmissionScreen';
import FollowUpQuestions from '../components/FollowUpQuestions';
import MainDashboard from '../components/MainDashboard';

type AppState = 'idea-submission' | 'follow-up-questions' | 'dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('idea-submission');
  const [userIdea, setUserIdea] = useState('');
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});

  const handleIdeaSubmit = (idea: string) => {
    setUserIdea(idea);
    setAppState('follow-up-questions');
  };

  const handleFollowUpComplete = (answers: Record<string, string>) => {
    setFollowUpAnswers(answers);
    setAppState('dashboard');
  };

  const handleBackToIdea = () => {
    setAppState('idea-submission');
  };

  return (
    <div className="min-h-screen bg-background">
      {appState === 'idea-submission' && (
        <IdeaSubmissionScreen onIdeaSubmit={handleIdeaSubmit} />
      )}
      
      {appState === 'follow-up-questions' && (
        <FollowUpQuestions 
          userIdea={userIdea}
          onComplete={handleFollowUpComplete}
          onBack={handleBackToIdea}
        />
      )}
      
      {appState === 'dashboard' && (
        <MainDashboard 
          userIdea={userIdea} 
          followUpAnswers={followUpAnswers}
        />
      )}
    </div>
  );
};

export default Index;
