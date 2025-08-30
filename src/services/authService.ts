import { User } from "@/types";
import apiClient from "@/lib/apiClient";

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  role?: 'admin' | 'user';
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
    created_at: string;
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
  private userrole: "admin" | "user" | null = null;
  private user: any = null;

  constructor() {
    // Load tokens and user data from localStorage on initialization
    this.token = localStorage.getItem("auth_token");
    this.refreshToken = localStorage.getItem("refresh_token");
    this.userrole = localStorage.getItem("user_role") as "admin" | "user" | null;
    
    // Load user data
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user_data");
      }
    }
    
    console.log("AuthService initialized with token:", this.token);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/login", { email, password });
      const data: LoginResponse = response.data;
      console.log("Login response:", data);
      console.log("Logined at", new Date().toISOString());

      if (data.success && data.token) {
        this.token = data.token;
        this.refreshToken = data.refreshToken;
        this.userrole = data.role as "admin" | "user";
        this.user = data.user;

        // Save to localStorage
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("refresh_token", data.refreshToken);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_data", JSON.stringify(data.user));

        return {
          success: true,
          token: data.token,
          refreshToken: data.refreshToken,
          role: data.role as "admin" | "user",
          message: data.message,
          user: data.user,
        };
      }

      return {
        success: false,
        message: data.message || "Login failed",
      };
    } catch (error) {
      console.error("Login error:", error);
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
      console.log("First name:", first_name);
      console.log("Last name:", last_name);

      // 1. Get user IP/location info
      const ipRes = await fetch("http://ip-api.com/json/");
      const ipData = await ipRes.json();
      console.log("IP Data:", ipData);
      console.log({
        first_name,
        last_name,
        email,
        password,
        country: ipData.country,
        city: ipData.city,
        lat: ipData.lat,
        lon: ipData.lon,
      })

      // 3. Send signup + location to backend
      const response = await apiClient.post("/signup", {
        first_name,
        last_name,
        email,
        password,
        country: ipData.country,
        city: ipData.city,
        lat: ipData.lat,
        lon: ipData.lon,
      });

      const data: SignupResponse = response.data;
      console.log("Signup response:", data);

      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.get(`/verify?token=${token}`);
      const data: VerificationResponse = response.data;
      console.log("Email verification response:", data);
      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      console.error("Email verification error:", error);
      return {
        success: false,
        message: "Email verification failed",
      };
    }
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/forget/password", { email });
      const data: ForgotPasswordResponse = response.data;

      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      console.error("Forgot password error:", error);
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
    console.log("Resetting password with token:", token);
    console.log("New password:", password);
    console.log({
      token,
      password,
      confirm_password,
    });
    try {
      const response = await apiClient.post(`/reset?token=${token}`, {
        token,
        password,
        confirm_password,
      });

      const data: ResetPasswordResponse = response.data;
      console.log("Reset password response:", data);
      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      console.error("Reset password error:", error);
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
      const response = await apiClient.post("/refresh-token", {
        refreshToken: this.refreshToken,
      });

      const data: RefreshResponse = response.data;

      if (data.success && data.token) {
        this.token = data.token;
        this.refreshToken = data.refreshToken;
        this.userrole = data.role as "admin" | "user";

        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("refresh_token", data.refreshToken);
        localStorage.setItem("user_role", data.role);

        return {
          success: true,
          token: data.token,
          refreshToken: data.refreshToken,
          role: data.role as "admin" | "user",
          message: data.message,
        };
      }

      return {
        success: false,
        message: data.message || "token refresh failed",
      };
    } catch (error) {
      console.error("token refresh error:", error);
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
      console.log("Creating session with idea:", idea);
      const response = await apiClient.post("/create/session", { "message":idea });
      const data = response.data;
      console.log("Create session response:", data);

      if (data.success && data.session_id) {
        sessionStorage.setItem("session_id", data.session_id);
      }

      return data;
    } catch (error) {
      console.error("Session creation error:", error);
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
    keys.forEach(key => {
      if (key.startsWith('chat_session_')) {
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

  getUserRole(): "admin" | "user" | null {
    return this.userrole || localStorage.getItem("user_role") as "admin" | "user" | null;
  }

  getUser(): any {
    if (this.user) return this.user;
    
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
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