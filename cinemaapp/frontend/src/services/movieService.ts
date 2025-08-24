import { authService } from './auth';
import {CreateMovieRequest, Movie, UpdateMovieRequest} from "../types/movie.ts";

const getApiUrl = () => window.ENV_CONFIG?.API_URL || 'http://localhost:3000';

export class MovieService {
  async getAllMovies(): Promise<Movie[]> {
    const response = await fetch(`${getApiUrl()}/movies`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    return response.json();
  }

  async createMovie(data: CreateMovieRequest): Promise<{ message: string; id: number }> {
    const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/movies/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create movie');
    }

    return response.json();
  }

  async updateMovie(id: number, data: UpdateMovieRequest): Promise<{ message: string }> {
    const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update movie');
    }

    return response.json();
  }

  async deleteMovie(id: number): Promise<{ message: string }> {
    const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/movies/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete movie';

      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        console.warn('Не удалось распарсить тело ошибки:', e);
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return { message: 'Movie deleted successfully' };
    }

    return response.json();
  }

}

export const movieService = new MovieService();
