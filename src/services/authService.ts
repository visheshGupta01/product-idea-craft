import { User } from "@/types";

const API_BASE_URL = "http://localhost:8000";

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  role?: 'admin' | 'user';
  session_id?: string;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  role: 'admin' | 'user';
}

export interface SignupResponse {
  success: boolean;
  message: string;
}

export interface RefreshResponse {
  Success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  role: 'admin' | 'user';
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
  Success: boolean;
  message: string;
}

export class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private userrole: 'admin' | 'user' | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    this.userrole = localStorage.getItem('user_role') as 'admin' | 'user' | null;
    console.log('AuthService initialized with token:', this.token);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();
      console.log('Login response:', data);
      
      if (data.success && data.token) {
        this.token = data.token;
        this.refreshToken = data.refreshToken;
        this.userrole = data.role;
        
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user_role', data.role);
        
        return {
          success: true,
          token: data.token,
          refreshToken: data.refreshToken,
          role: data.role,
          message: data.message
        };
      }

      return {
        success: false,
        message: data.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const [first_name, ...rest] = name.trim().split(" ");
      const last_name = rest.join(" ");
      console.log('First name:', first_name);
      console.log('Last name:', last_name);
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
        }),
      });

      const data: SignupResponse = await response.json();
      console.log('Signup response:', data);

      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/verify?token=${token}`, {
        method: 'GET',
      });

      const data: VerificationResponse = await response.json();
      console.log('Email verification response:', data);
      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'Email verification failed',
      };
    }
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/forget/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data: ForgotPasswordResponse = await response.json();
      
      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async resetPassword(token: string, password: string, confirm_password: string): Promise<AuthResponse> {
    console.log('Resetting password with token:', token);
    console.log('New password:', password);
    console.log({
      token,
      password,
      confirm_password,
    });
    try {
      const response = await fetch(`${API_BASE_URL}/reset?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password,confirm_password
        }),
      });

      const data: ResetPasswordResponse = await response.json();
      console.log('Reset password response:', data);
      return {
        success: data.Success,
        message: data.message
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async refreshAccessToken(): Promise<AuthResponse> {
    if (!this.refreshToken) {
      return { success: false, message: 'No refresh token available' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          refreshToken: this.refreshToken 
        }),
      });

      const data: RefreshResponse = await response.json();
      
      if (data.Success && data.token) {
        this.token = data.token;
        this.refreshToken = data.refreshToken;
        this.userrole = data.role;
        
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user_role', data.role);
        
        return {
          success: true,
          token: data.token,
          refreshToken: data.refreshToken,
          role: data.role,
          message: data.message
        };
      }

      return {
        success: false,
        message: data.message || 'token refresh failed'
      };
    } catch (error) {
      console.error('token refresh error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async createSessionWithIdea(idea: string): Promise<{ session_id: string; success: boolean; message?: string }> {
    if (!this.token) {
      return { success: false, session_id: '', message: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/create/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();
      console.log('Create session response:', data);
      
      if (data.success && data.session_id) {
        sessionStorage.setItem('session_id', data.session_id);
      }

      return data;
    } catch (error) {
      console.error('Session creation error:', error);
      return {
        success: false,
        session_id: '',
        message: 'Failed to create session',
      };
    }
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    this.userrole = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    sessionStorage.removeItem('session_id');
    sessionStorage.removeItem('user_idea');
  }

  getToken(): string | null {
    return this.token;
  }

  getrefreshToken(): string | null {
    return this.refreshToken;
  }

  getUserRole(): 'admin' | 'user' | null {
    return this.userrole;
  }

  getSessionId(): string | null {
    return sessionStorage.getItem('session_id');
  }

  setUserIdea(idea: string): void {
    sessionStorage.setItem('user_idea', idea);
  }

  getUserIdea(): string | null {
    return sessionStorage.getItem('user_idea');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return this.userrole === 'admin';
  }

  isUser(): boolean {
    return this.userrole === 'user';
  }
}

export const authService = new AuthService();