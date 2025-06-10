
import React, { useState } from 'react';
import IdeaSubmissionScreen from '../components/IdeaSubmissionScreen';
import MainDashboard from '../components/MainDashboard';

const Index = () => {
  const [hasSubmittedIdea, setHasSubmittedIdea] = useState(false);
  const [userIdea, setUserIdea] = useState('');

  const handleIdeaSubmit = (idea: string) => {
    setUserIdea(idea);
    setHasSubmittedIdea(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {!hasSubmittedIdea ? (
        <IdeaSubmissionScreen onIdeaSubmit={handleIdeaSubmit} />
      ) : (
        <MainDashboard userIdea={userIdea} />
      )}
    </div>
  );
};

export default Index;
