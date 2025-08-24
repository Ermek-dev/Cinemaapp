import { Hall, CreateHallRequest, UpdateHallRequest } from '../types/hall';
import { authService } from './auth';

const getApiUrl = () => window.ENV_CONFIG?.API_URL || 'http://localhost:3000';

export class HallService {
  async getHalls(): Promise<Hall[]> {
    const response = await fetch(`${getApiUrl()}/halls`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch halls');
    }

    return response.json();
  }

  async createHall(data: CreateHallRequest): Promise<{ message: string; id: number }> {
    const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/halls/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create hall');
    }

    return response.json();
  }

  async updateHall(id: number, data: UpdateHallRequest): Promise<{ message: string }> {
    const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/halls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update hall');
    }

    return response.json();
  }

  async deleteHall(id: number): Promise<{ message: string }> {
    const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/halls/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete hall');
    }

    return response.json();
  }
}

export const hallService = new HallService();
