import { Movie } from '../types/movie';

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
export async function getMovies(search?: string): Promise<Movie[]> {
  try {
    const url = new URL(`${getApiUrl()}/movies`);
    if (search) {
      url.searchParams.append('search', search);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('API error');
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch movies from API, using mock data', error);
    return error;
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
    return error;
  }
}
