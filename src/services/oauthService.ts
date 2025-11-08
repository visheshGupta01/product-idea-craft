import { API_BASE_URL } from "@/config/api";

export const initiateGoogleAuth = () => {
  window.location.href = `${API_BASE_URL}/api/google/auth/login`;
};

export const initiateGithubAuth = () => {
  window.location.href = `${API_BASE_URL}/api/github/auth/login`;
};

export const handleOAuthCallback = async (
  token: string,
  refreshToken: string,
  user: any,
  role: string
) => {
  // Store tokens and user data
  localStorage.setItem("authToken", token);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("userRole", role);
  localStorage.setItem("userData", JSON.stringify(user));
  
  return {
    success: true,
    message: "Authentication successful",
    token,
    refreshToken,
    role,
    user,
  };
};
