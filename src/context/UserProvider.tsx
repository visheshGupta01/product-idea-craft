
import { ReactNode, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { User, InitialResponse } from "@/types";
import { authService } from "@/services/authService";
import { ProfileData, fetchProfile, updateProfile } from "@/services/profileService";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userIdea, setUserIdea] = useState<string | null>(null);
  const [initialResponse, setInitialResponse] = useState<InitialResponse | null>(null);
  const [isProcessingIdea, setIsProcessingIdea] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<{
    planId: number;
    planName: string;
    isActive: boolean;
    expiresAt: string | null;
  } | null>(null);

  // Check authentication and restore chat state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        const role = authService.getUserRole();
        const userData = authService.getUser();
        const storedSessionId = authService.getSessionId();
        const storedUserIdea = authService.getUserIdea();
        
        if (token && role) {
          setIsAuthenticated(true);
          setUserRole(role);
          
          // Set user data from localStorage if available
          if (userData) {
            const mappedUser: User = {
              id: userData.id,
              firstName: userData.first_name,
              lastName: userData.last_name,
              email: userData.email,
              avatar: '',
              verified: true,
              userType: userData.user_type
            };
            setUser(mappedUser);
            
            // Create profile data from user data
            setProfile({
              id: userData.id,
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              user_type: userData.user_type,
              created_at: userData.created_at
            });

            // Update user plan information if available
            if ((userData as any).plan_id) {
              const planNames = { 1: 'Free', 2: 'Pro', 3: 'Team' };
              setUserPlan({
                planId: (userData as any).plan_id || 1,
                planName: planNames[(userData as any).plan_id as keyof typeof planNames] || 'Free',
                isActive: (userData as any).is_plan_active || false,
                expiresAt: (userData as any).plan_expires_at || null,
              });
            }
          } else {
            // Fallback: fetch profile data if not in localStorage
            await fetchUserProfile();
          }
          
          if (storedSessionId) {
            setSessionId(storedSessionId);
          }
          if (storedUserIdea) {
            setUserIdea(storedUserIdea);
          }
        }
      } catch (error) {
        console.error('Error during auth check:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setIsAuthenticated(true);
      setUserRole(result.role || null);
      
      // Map API user data to our User type
      const userData: User = {
        id: result.user.id,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        email: result.user.email,
        avatar: '', // Default avatar
        verified: true, // If they can login, they're verified
        userType: result.user.user_type
      };
      setUser(userData);
      
      // Set profile data from login response
      setProfile({
        id: result.user.id,
        first_name: result.user.first_name,
        last_name: result.user.last_name,
        email: result.user.email,
        user_type: result.user.user_type,
        created_at: result.user.created_at
      });

      // Update user plan information if available
      if ((result.user as any).plan_id) {
        const planNames = { 1: 'Free', 2: 'Pro', 3: 'Team' };
        setUserPlan({
          planId: (result.user as any).plan_id || 1,
          planName: planNames[(result.user as any).plan_id as keyof typeof planNames] || 'Free',
          isActive: (result.user as any).is_plan_active || false,
          expiresAt: (result.user as any).plan_expires_at || null,
        });
      }
    }
    return { success: result.success, message: result.message, role: result.role };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    setUserRole(null);
    setSessionId(null);
    setUserIdea(null);
    setInitialResponse(null);
    setUserPlan(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    const result = await authService.signup(name, email, password);
    console.log('Signup result:', result); 
    return { success: result.success, message: result.message };
  };

  const verifyEmail = async (token: string) => {
    const result = await authService.verifyEmail(token);
    return { success: result.success, message: result.message };
  };

  const forgotPassword = async (email: string) => {
    const result = await authService.forgotPassword(email);
    return { success: result.success, message: result.message };
  };

  const resetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
    const result = await authService.resetPassword(token, newPassword, confirmPassword);
    return { success: result.success, message: result.message };
  };

  const refreshToken = async () => {
    const result = await authService.refreshAccessToken();
    if (result.success) {
      setIsAuthenticated(true);
      setUserRole(result.role || null);
    }
    return { success: result.success, message: result.message };
  };

  const sendIdeaWithAuth = async (idea: string) => {
    if (!isAuthenticated) {
      console.log("User is not authenticated.");
      return { success: false, message: "Please login first" };
    }
console.log("Sending idea:", idea);
    setIsProcessingIdea(true);
    
    try {
      // Create session with the idea
      const result = await authService.createSessionWithIdea(idea);
      
      if (result.success && result.session_id) {
        setSessionId(result.session_id);
        setUserIdea(idea);
        // Persist the user idea to localStorage
        authService.setUserIdea(idea);
        
        // Create initial response for display
        const initialResponse: InitialResponse = {
          userMessage: idea,
          aiResponse: "",
          timestamp: new Date(),
        };
        setInitialResponse(initialResponse);
        
        return { success: true, session_id: result.session_id };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error creating session with idea:", error);
      return { success: false, message: "Failed to process idea" };
    } finally {
      setIsProcessingIdea(false);
    }
  };

  const clearInitialResponse = () => {
    setInitialResponse(null);
  };

  const fetchUserProfile = async () => {
    try {
      const profileData = await fetchProfile();
      setProfile(profileData);
      
      // Update user plan information if available in profile
      if (profileData && 'plan_id' in profileData) {
        const planNames = { 1: 'Free', 2: 'Pro', 3: 'Team' };
        setUserPlan({
          planId: (profileData as any).plan_id || 1,
          planName: planNames[(profileData as any).plan_id as keyof typeof planNames] || 'Free',
          isActive: (profileData as any).is_plan_active || false,
          expiresAt: (profileData as any).plan_expires_at || null,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateUserProfile = async (data: Partial<ProfileData>) => {
    try {
      const result = await updateProfile(data);
      if (result.success) {
        // Refresh profile data
        await fetchUserProfile();
      }
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      profile,
      userIdea, 
      initialResponse,
      isProcessingIdea,
      isAuthenticated,
      sessionId,
      userRole,
      isLoading,
      userPlan,
      login, 
      logout, 
      signup,
      verifyEmail,
      forgotPassword,
      resetPassword,
      refreshToken,
      setUserIdea,
      setSessionId,
      sendIdeaWithAuth,
      clearInitialResponse,
      fetchProfile: fetchUserProfile,
      updateProfile: updateUserProfile
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
