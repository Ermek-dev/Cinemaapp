import { LoginRequest, RegisterRequest, AuthResponse, RefreshResponse } from '../types/auth';

const getApiUrl = () => window.ENV_CONFIG?.API_URL || 'http://localhost:3000';

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokensFromStorage() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async register(data: RegisterRequest): Promise<{ message: string }> {
    const response = await fetch(`${getApiUrl()}/accounts/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${getApiUrl()}/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const authResponse: AuthResponse = await response.json();
    this.saveTokensToStorage(authResponse.accessToken, authResponse.refreshToken);
    return authResponse;
  }

  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${getApiUrl()}/accounts/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) {
      this.clearTokensFromStorage();
      throw new Error('Token refresh failed');
    }

    const refreshResponse: RefreshResponse = await response.json();
    this.accessToken = refreshResponse.accessToken;
    localStorage.setItem('accessToken', refreshResponse.accessToken);
    return refreshResponse.accessToken;
  }

  logout() {
    this.clearTokensFromStorage();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getUserFromToken(): { email: string; role: 'user' | 'admin' } | null {
    if (!this.accessToken) return null;

    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      return {
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    let token = this.getAccessToken();

    if (!token) {
      throw new Error('No access token available');
    }

    const makeRequest = async (authToken: string) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
    };

    let response = await makeRequest(token);

    if (response.status === 401) {
      try {
        token = await this.refreshAccessToken();
        response = await makeRequest(token);
      } catch {
        this.logout();
        throw new Error('Authentication failed');
      }
    }

    return response;
  }
}

export const authService = new AuthService();
