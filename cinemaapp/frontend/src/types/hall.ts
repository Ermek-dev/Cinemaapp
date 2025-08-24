export interface Hall {
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
}

export interface CreateHallRequest {
  name: string;
  rows: number;
  seatsPerRow: number;
}

export interface UpdateHallRequest {
  name?: string;
  rows?: number;
  seatsPerRow?: number;
}
