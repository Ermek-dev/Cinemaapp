export interface Booking {
    id: number;
    userId: number;
    sessionId: number;
    seats: Seat[];
    createdAt: string;
}

export interface Seat {
    row: number;
    seat: number;
}

export interface CreateBookingRequest {
    sessionId: number;
    seats: Seat[];
}

export interface CreateBookingResponse {
    message: string;
    bookingId: number;
}

export interface SessionSeatsResponse {
    sessionId: number;
    takenSeats: Seat[];
}

export interface WebSocketSeatUpdate {
    type: 'seat_update';
    sessionId: number;
    takenSeats: Seat[];
}
