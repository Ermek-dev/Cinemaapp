export interface Session {
  id: number;
  movieId: number;
  hallId: number;
  startTime: string;
  price: number;
}

export interface CreateSessionRequest {
  movieId: number;
  hallId: number;
  startTime: string;
  price: number;
}

export interface UpdateSessionRequest {
  movieId?: number;
  hallId?: number;
  startTime?: string;
  price?: number;
}
