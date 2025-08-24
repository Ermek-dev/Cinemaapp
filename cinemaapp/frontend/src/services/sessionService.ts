import { Session, CreateSessionRequest, UpdateSessionRequest } from '../types/session';
import { authService } from './auth';

const getApiUrl = () => window.ENV_CONFIG?.API_URL || 'http://localhost:3000';

export interface SessionFilters {
  movieId?: number;
  hallId?: number;
  date?: string; // YYYY-MM-DD format
}

export class SessionService {
  async getSessions(filters?: SessionFilters): Promise<Session[]> {
    let url = `${getApiUrl()}/showtimes/sessions`;
    
    if (filters) {
      const params = new URLSearchParams();
      if (filters.movieId) params.append('movieId', filters.movieId.toString());
      if (filters.hallId) params.append('hallId', filters.hallId.toString());
      if (filters.date) params.append('date', filters.date);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    return response.json();
  }

  async createSession(data: CreateSessionRequest): Promise<{ message: string; id: number }> {
    const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/showtimes/sessions/create/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create session');
    }

    return response.json();
  }

  async updateSession(id: number, data: UpdateSessionRequest): Promise<{ message: string }> {
    const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/showtimes/sessions/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update session');
    }

    return response.json();
  }

  async deleteSession(id: number): Promise<{ message: string }> {
    const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/showtimes/sessions/delete/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete session');
    }

    return response.json();
  }
}

export const sessionService = new SessionService();
