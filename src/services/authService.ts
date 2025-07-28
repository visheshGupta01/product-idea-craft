const API_BASE_URL = 'https://d6d57fc4551a.ngrok-free.app';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Load token and user from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user_data');
      }
    }
  }

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || 'Account created successfully. Please check your email for verification.',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Signup failed',
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
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

      if (response.ok && data.success) {
        this.token = data.token;
        this.user = data.user;

        // Store in localStorage
        localStorage.setItem('auth_token', this.token!);
        localStorage.setItem('user_data', JSON.stringify(this.user));

        return {
          success: true,
          message: data.message || 'Login successful',
          user: this.user,
          token: this.token,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  async verify(email: string, code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || 'Email verified successfully',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Verification failed',
        };
      }
    } catch (error) {
      console.error('Verification error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  // Get dashboard URL based on user role
  getDashboardUrl(): string {
    if (!this.user) return '/login';
    
    switch (this.user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'developer':
        return '/developer/dashboard';
      case 'user':
        return '/user/dashboard';
      default:
        return '/dashboard';
    }
  }
}

export const authService = new AuthService();