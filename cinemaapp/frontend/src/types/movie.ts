export interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  posterUrl: string;
  createdAt: string;
}
export interface CreateMovieRequest {
  title: string;
  description: string;
  duration: number;
  posterUrl: string;
}

export interface UpdateMovieRequest {
  title: string;
  description: string;
  duration: number;
  posterUrl: string;
}
