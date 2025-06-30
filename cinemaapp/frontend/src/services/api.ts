import { Movie } from '../types/movie';
import { mockMovies } from '../data/mockData';

declare global {
  interface Window {
    ENV_CONFIG: {
      API_URL: string;
    };
  }
}

const getApiUrl = () => window.ENV_CONFIG?.API_URL || 'http://localhost:3000';

/**
 * Fetch all movies from the API
 * Falls back to mock data if API is unavailable
 */
export async function getMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(`${getApiUrl()}/movies`);
    if (!response.ok) {
      throw new Error('API error');
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch movies from API, using mock data', error);
    return mockMovies;
  }
}

/**
 * Fetch a specific movie by ID
 * Falls back to mock data if API is unavailable
 */
export async function getMovieById(id: number | string): Promise<Movie | null> {
  try {
    const response = await fetch(`${getApiUrl()}/movies/${id}`);
    if (!response.ok) {
      throw new Error('API error');
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch movie ${id} from API, using mock data`, error);
    const mockMovie = mockMovies.find(movie => movie.id === Number(id));
    return mockMovie || null;
  }
}