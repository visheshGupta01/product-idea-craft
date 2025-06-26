
import React, { useState } from 'react';
import IdeaSubmissionScreen from '../components/IdeaSubmissionScreen';
import FollowUpQuestions from '../components/FollowUpQuestions';
import VerificationScreen from '../components/VerificationScreen';
import MainDashboard from '../components/MainDashboard';
import Navbar from '../components/Navbar';
import LoginPage from '../components/auth/LoginPage';
import SignupPage from '../components/auth/SignupPage';

type AppState = 'idea-submission' | 'follow-up-questions' | 'verification' | 'dashboard';
type AuthModal = 'login' | 'signup' | null;

const Index = () => {
  const [appState, setAppState] = useState<AppState>('idea-submission');
  const [userIdea, setUserIdea] = useState('');
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [pendingIdea, setPendingIdea] = useState<string>('');
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);

  const handleIdeaSubmit = (idea: string) => {
    if (!user) {
      // Store the idea and show login modal
      setPendingIdea(idea);
      setIsSubmittingIdea(true);
      setAuthModal('login');
      return;
    }
    
    setUserIdea(idea);
    setAppState('follow-up-questions');
  };

  const handleFollowUpComplete = (answers: Record<string, string>) => {
    setFollowUpAnswers(answers);
    setAppState('verification');
  };

  const handleVerificationComplete = () => {
    setAppState('dashboard');
  };

  const handleBackToIdea = () => {
    setAppState('idea-submission');
  };

  const handleLogin = (email: string, password: string) => {
    // Simulate login - in real app, this would call an API
    const userData = {
      name: email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    setUser(userData);
    setAuthModal(null);
    setIsSubmittingIdea(false);
    
    // If there was a pending idea, process it now
    if (pendingIdea) {
      setUserIdea(pendingIdea);
      setPendingIdea('');
      setAppState('follow-up-questions');
    }
  };

  const handleSignup = (email: string, password: string, name: string) => {
    // Simulate signup - in real app, this would call an API
    const userData = {
      name: name,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    setUser(userData);
    setAuthModal(null);
    setIsSubmittingIdea(false);
    
    // If there was a pending idea, process it now
    if (pendingIdea) {
      setUserIdea(pendingIdea);
      setPendingIdea('');
      setAppState('follow-up-questions');
    }
  };

  const handleAuthModalClose = () => {
    setAuthModal(null);
    setPendingIdea('');
    setIsSubmittingIdea(false);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('idea-submission');
    setUserIdea('');
    setFollowUpAnswers({});
    setPendingIdea('');
    setIsSubmittingIdea(false);
  };

  const isFullSizePage = appState !== 'idea-submission';

  return (
    <div className="min-h-screen bg-background">
      {/* Show navbar only on idea submission page */}
      {appState === 'idea-submission' && (
        <Navbar
          user={user}
          onLoginClick={() => setAuthModal('login')}
          onSignupClick={() => setAuthModal('signup')}
          onLogout={handleLogout}
        />
      )}
      
      <div className={isFullSizePage ? "h-screen" : ""}>
        {appState === 'idea-submission' && (
          <IdeaSubmissionScreen 
            onIdeaSubmit={handleIdeaSubmit} 
            user={user} 
            isSubmitting={isSubmittingIdea}
          />
        )}
        
        {appState === 'follow-up-questions' && (
          <FollowUpQuestions 
            userIdea={userIdea}
            onComplete={handleFollowUpComplete}
            onBack={handleBackToIdea}
          />
        )}

        {appState === 'verification' && (
          <VerificationScreen 
            onComplete={handleVerificationComplete}
          />
        )}
        
        {appState === 'dashboard' && (
          <MainDashboard 
            userIdea={userIdea} 
            followUpAnswers={followUpAnswers}
          />
        )}
      </div>

      {/* Auth Modals */}
      {authModal === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthModal('signup')}
          onClose={handleAuthModalClose}
        />
      )}

      {authModal === 'signup' && (
        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthModal('login')}
          onClose={handleAuthModalClose}
        />
      )}
    </div>
  );
};

export default Index;
