import { ReactNode, useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import { User, InitialResponse } from "@/types";
import { authService } from "@/services/authService";
import {
  ProfileData,
  fetchProfile,
  updateProfile,
} from "@/services/profileService";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userIdea, setUserIdea] = useState<string | null>(null);
  const [initialResponse, setInitialResponse] =
    useState<InitialResponse | null>(null);
  const [isProcessingIdea, setIsProcessingIdea] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<
    "admin" | "user" | "developer" | null
  >(null);
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
              avatar: "",  
              verified: userData.verified,
              userType: userData.user_type,
            };
            setUser(mappedUser);

            fetchUserProfile();

            // Create profile data from user data with defaults
            const planNames = { 1: "Free", 2: "Pro", 3: "Team" };
            const planId = (userData as any).plan_id || 1;
            setProfile({
              id: userData.id,
              name: (userData as any).name || `${userData.first_name} ${userData.last_name}`,
              email: userData.email,
              password: "",
              plan_name: planNames[planId as keyof typeof planNames] || "Free",
              verified: (userData as any).verified || false,
              token: (userData as any).token || "",
              country: (userData as any).country || "",
              city: (userData as any).city || "",
              lat: (userData as any).lat || 0,
              lon: (userData as any).lon || 0,
              user_type: userData.user_type,
              plan_id: (userData as any).plan_id || 1,
              price: (userData as any).price || {
                id: 0,
                name: "",
                price: 0,
                is_default: false,
              },
              plan_started_at: (userData as any).plan_started_at || null,
              plan_expires_at: (userData as any).plan_expires_at || null,
              is_plan_active: (userData as any).is_plan_active || false,
              balances: (userData as any).balances || 0,
              rating: (userData as any).rating || undefined,
              reset_token: (userData as any).reset_token || "",
              reset_token_expiry: (userData as any).reset_token_expiry || null,
              github_access_token:
                (userData as any).github_access_token || undefined,
              vercel_access_token:
                (userData as any).vercel_access_token || undefined,
              created_at: userData.created_at,
              last_login_at:
                (userData as any).last_login_at || userData.created_at,
              github_url: (userData as any).github_url || "",
              linkedin_url: (userData as any).linkedin_url || "",
              total_solved_tasks: (userData as any).total_solved_tasks || 0,
              total_pending_task: (userData as any).total_pending_task || 0,
              total_in_progress_task:
                (userData as any).total_in_progress_task || 0,
              company_name: (userData as any).company_name || "",
              experience: (userData as any).experience || 0,
              skills: (userData as any).skills || null,
              bio: (userData as any).bio || "",
              hourpaid: (userData as any).hourpaid || 0,
              avg_rating: (userData as any).avg_rating || 0,
              rating_count: (userData as any).rating_count || 0,
              status:
                (userData as any).status !== undefined
                  ? (userData as any).status
                  : true,
              credits: (userData as any).credits || 0,
            });

            // Update user plan information if available
            if ((userData as any).plan_id) {
              const planNames = { 1: "Free", 2: "Pro", 3: "Team" };
              setUserPlan({
                planId: (userData as any).plan_id || 1,
                planName:
                  planNames[
                    (userData as any).plan_id as keyof typeof planNames
                  ] || "Free",
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
        //console.error("Error during auth check:", error);
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
        avatar: "", // Default avatar
        verified: result.user.verified, // If they can login, they're verified
        userType: result.user.user_type,
      };
      setUser(userData);

      // Set profile data from login response with defaults
      const planNames = { 1: "Free", 2: "Pro", 3: "Team" };
      const planId = (result.user as any).plan_id || 1;
      setProfile({
        id: result.user.id,
        name: (result.user as any).name || `${result.user.first_name} ${result.user.last_name}`,
        email: result.user.email,
        password: "",
        plan_name: planNames[planId as keyof typeof planNames] || "Free",
        verified: (result.user as any).verified || false,
        token: (result.user as any).token || "",
        country: (result.user as any).country || "",
        city: (result.user as any).city || "",
        lat: (result.user as any).lat || 0,
        lon: (result.user as any).lon || 0,
        user_type: result.user.user_type,
        plan_id: (result.user as any).plan_id || 1,
        price: (result.user as any).price || {
          id: 0,
          name: "",
          price: 0,
          is_default: false,
        },
        plan_started_at: (result.user as any).plan_started_at || null,
        plan_expires_at: (result.user as any).plan_expires_at || null,
        is_plan_active: (result.user as any).is_plan_active || false,
        balances: (result.user as any).balances || 0,
        rating: (result.user as any).rating || undefined,
        reset_token: (result.user as any).reset_token || "",
        reset_token_expiry: (result.user as any).reset_token_expiry || null,
        github_access_token:
          (result.user as any).github_access_token || undefined,
        vercel_access_token:
          (result.user as any).vercel_access_token || undefined,
        created_at: result.user.created_at,
        last_login_at:
          (result.user as any).last_login_at || result.user.created_at,
        github_url: (result.user as any).github_url || "",
        linkedin_url: (result.user as any).linkedin_url || "",
        total_solved_tasks: (result.user as any).total_solved_tasks || 0,
        total_pending_task: (result.user as any).total_pending_task || 0,
        total_in_progress_task:
          (result.user as any).total_in_progress_task || 0,
        company_name: (result.user as any).company_name || "",
        experience: (result.user as any).experience || 0,
        skills: (result.user as any).skills || null,
        bio: (result.user as any).bio || "",
        hourpaid: (result.user as any).hourpaid || 0,
        avg_rating: (result.user as any).avg_rating || 0,
        rating_count: (result.user as any).rating_count || 0,
        status:
          (result.user as any).status !== undefined
            ? (result.user as any).status
            : true,
        credits: (result.user as any).credits || 0,
      });

      // Update user plan information if available
      if ((result.user as any).plan_id) {
        const planNames = { 1: "Free", 2: "Pro", 3: "Team" };
        setUserPlan({
          planId: (result.user as any).plan_id || 1,
          planName:
            planNames[(result.user as any).plan_id as keyof typeof planNames] ||
            "Free",
          isActive: (result.user as any).is_plan_active || false,
          expiresAt: (result.user as any).plan_expires_at || null,
        });
      }

      fetchUserProfile();

      // Auto-redirect developers to developer dashboard
      if (result.user.user_type === "developer") {
        window.location.href = "/developer";
      }
    }
    return {
      success: result.success,
      message: result.message,
      role: result.role,
    };
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
    //console.log('Signup result:', result);
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

  const resetPassword = async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const result = await authService.resetPassword(
      token,
      newPassword,
      confirmPassword
    );
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
      //console.log("User is not authenticated.");
      return { success: false, message: "Please login first" };
    }

    // Check if user email is verified
    const userData = authService.getUser();
    if (userData && !userData.verified) {
      return { success: false, message: "Email not verified", requiresVerification: true };
    }

    //console.log("Sending idea:", idea);
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
      //console.error("Error creating session with idea:", error);
      return { success: false, message: "Failed to process idea" };
    } finally {
      setIsProcessingIdea(false);
    }
  };

  const clearInitialResponse = () => {
    setInitialResponse(null);
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const profileData = await fetchProfile();
      setProfile(profileData);

      // Update user plan information if available in profile
      if (profileData && "plan_id" in profileData) {
        const planNames = { 1: "Free", 2: "Pro", 3: "Team" };
        setUserPlan({
          planId: (profileData as any).plan_id || 1,
          planName:
            planNames[(profileData as any).plan_id as keyof typeof planNames] ||
            "Free",
          isActive: (profileData as any).is_plan_active || false,
          expiresAt: (profileData as any).plan_expires_at || null,
        });
      }
    } catch (error) {
      //console.error("Error fetching profile:", error);
    }
  }, []);

  const updateUserProfile = useCallback(
    async (data: Partial<ProfileData>) => {
      try {
        const result = await updateProfile(data);
        if (result.success) {
          // Refresh profile data
          await fetchUserProfile();
        }
        return result;
      } catch (error) {
        //console.error("Error updating profile:", error);
        return { success: false, message: "Failed to update profile" };
      }
    },
    [fetchUserProfile]
  );

  return (
    <UserContext.Provider
      value={{
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
        updateProfile: updateUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
