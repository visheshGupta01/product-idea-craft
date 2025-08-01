import { User } from "@/types";

const API_BASE_URL = "http://localhost:8000";

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  session_id?: string;
  message?: string;
}

export class AuthService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
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

      const data = await response.json();
console.log('Login response:', data);
      if (data.token) {
        this.token = data.token;
        console.log('Setting token:', data.token);
        localStorage.setItem('auth_token', data.token);
        if (data.session_id) {
          localStorage.setItem('session_id', data.session_id);
        }
      }

      return data;
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
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" "); // Handles names like "John Smith Doe"
console.log('Signup data:', { firstName, lastName, email, password });
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log('Signup response:', data);

    if (data.success && data.token) {
      this.token = data.token;
      localStorage.setItem('auth_token', data.token);
      if (data.session_id) {
        localStorage.setItem('session_id', data.session_id);
      }
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}


  // async validateToken(): Promise<AuthResponse> {
  //   if (!this.token) {
  //     return { success: false, message: 'No token found' };
  //   }

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/verify`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${this.token}`,
  //       },
  //     });

  //     const data = await response.json();

  //     if (!data.success) {
  //       this.logout();
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error('Token validation error:', error);
  //     this.logout();
  //     return {
  //       success: false,
  //       message: 'Token validation failed',
  //     };
  //   }
  // }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/verify?token=${token}`, {
        method: 'GET',
      });

      return await response.json();
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: 'Email verification failed',
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
        localStorage.setItem('session_id', data.session_id);
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
    localStorage.removeItem('auth_token');
    localStorage.removeItem('session_id');
  }

  getToken(): string | null {
    return this.token;
  }

  getSessionId(): string | null {
    return localStorage.getItem('session_id');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();