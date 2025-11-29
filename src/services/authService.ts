import { User } from "@/types";
import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { parseJWT, storeJWTData } from "@/lib/jwtUtils";

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  role?: "admin" | "user" | "developer";
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    created_at: string;
    verified?: boolean;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  role: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    created_at: string;
    verified?: boolean;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  role: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private userrole: "admin" | "user" | "developer" | null = null;
  private user: any = null;

  constructor() {
    // Load tokens and user data from localStorage on initialization
    this.token = localStorage.getItem("auth_token");
    this.refreshToken = localStorage.getItem("refresh_token");
    this.userrole = localStorage.getItem("user_role") as
      | "admin"
      | "user"
      | "developer"
      | null;

    // Load user data
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (error) {
        localStorage.removeItem("user_data");
      }
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      const data: LoginResponse = response.data;

      if (data.success && data.token) {
        // Parse JWT and extract data from token
        const jwtResult = storeJWTData(data.token, data.refreshToken);
        // console.log("Login JWT Result:", jwtResult);
        if (jwtResult) {
          this.token = data.token;
          this.refreshToken = data.refreshToken;
          this.userrole = jwtResult.payload.user.user_type as
            | "admin"
            | "user"
            | "developer";
          this.user = jwtResult.payload.user;

          return {
            success: true,
            token: data.token,
            refreshToken: data.refreshToken,
            role: jwtResult.payload.user.user_type as
              | "admin"
              | "user"
              | "developer",
            message: data.message,
            user: jwtResult.payload.user,
          };
        }
      }

      return {
        success: false,
        message: data.message || "Login failed",
      };
    } catch (error: any) {
      // Check if error response contains error object with message
      if (error.response?.data?.error?.message) {
        return {
          success: false,
          message: error.response.data.error.message,
        };
      }

      // Check if error response has direct message
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message,
        };
      }

      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const [first_name, ...rest] = name.trim().split(" ");
      const last_name = rest.join(" ");

      // 3. Send signup + location to backend
      const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, {
        first_name,
        last_name,
        email,
        password,
      });

      const data: SignupResponse = response.data;

      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.AUTH.VERIFY}?token=${token}`
      );
      const data: VerificationResponse = response.data;
      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: "Email verification failed",
      };
    }
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        {
          email,
        }
      );
      const data: ForgotPasswordResponse = response.data;

      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  async resetPassword(
    token: string,
    password: string,
    confirm_password: string
  ): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.AUTH.RESET_PASSWORD}?token=${token}`,
        {
          token,
          password,
          confirm_password,
        }
      );

      const data: ResetPasswordResponse = response.data;
      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  async refreshAccessToken(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      return { success: false, message: "No refresh token available" };
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken: this.refreshToken,
      });

      const data: RefreshResponse = response.data;

      if (data.success && data.token) {
        // Parse JWT and extract data from token
        const jwtResult = storeJWTData(data.token, data.refreshToken);
        // console.log("Refresh JWT Result:", jwtResult);
        if (jwtResult) {
          this.token = data.token;
          this.refreshToken = data.refreshToken;
          this.userrole = jwtResult.payload.user.user_type as
            | "admin"
            | "user"
            | "developer";

          return {
            success: true,
            token: data.token,
            refreshToken: data.refreshToken,
            role: jwtResult.payload.user.user_type as
              | "admin"
              | "user"
              | "developer",
            message: data.message,
          };
        }
      }

      return {
        success: false,
        message: data.message || "token refresh failed",
      };
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  async createSessionWithIdea(
    idea: string
  ): Promise<{ session_id: string; success: boolean; message?: string }> {
    if (!this.token) {
      return { success: false, session_id: "", message: "Not authenticated" };
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.CHAT.SESSION_CREATE, {
        message: idea,
      });
      const data = response.data;

      if (data.success && data.session_id) {
        sessionStorage.setItem("session_id", data.session_id);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        session_id: "",
        message: "Failed to create session",
      };
    }
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    this.userrole = null;
    this.user = null;

    // Clear all auth data from localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_data");

    // Clear session data
    sessionStorage.removeItem("session_id");
    sessionStorage.removeItem("user_idea");

    // Clear all chat sessions
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith("chat_session_")) {
        sessionStorage.removeItem(key);
      }
    });
  }

  getToken(): string | null {
    return this.token || localStorage.getItem("auth_token");
  }

  getRefreshToken(): string | null {
    return this.refreshToken || localStorage.getItem("refresh_token");
  }

  getUserRole(): "admin" | "user" | null | "developer" {
    return (
      this.userrole ||
      (localStorage.getItem("user_role") as
        | "admin"
        | "user"
        | null
        | "developer")
    );
  }

  getUser(): any {
    if (this.user) return this.user;

    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  setUser(userData: any): void {
    this.user = userData;
    localStorage.setItem("user_data", JSON.stringify(userData));
  }

  getSessionId(): string | null {
    return sessionStorage.getItem("session_id");
  }

  setUserIdea(idea: string): void {
    sessionStorage.setItem("user_idea", idea);
  }

  getUserIdea(): string | null {
    return sessionStorage.getItem("user_idea");
  }

  isAuthenticated(): boolean {
    return !!(this.token || localStorage.getItem("auth_token"));
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === "admin";
  }

  isUser(): boolean {
    const role = this.getUserRole();
    return role === "user";
  }
}

export const authService = new AuthService();
