import { Booking, CreateBookingRequest, CreateBookingResponse, SessionSeatsResponse } from '../types/booking';
import { authService } from "./auth.ts";

const getApiUrl = () => window.ENV_CONFIG?.API_URL || 'http://localhost:3000';
const getWsUrl = () => window.ENV_CONFIG?.WS_URL || 'ws://localhost:3000';

class BookingService {
    private getAuthHeaders() {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };
    }

    async createBooking(bookingData: CreateBookingRequest): Promise<CreateBookingResponse> {
        try {
            const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/booking/bookings`, {
                method: 'POST',
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Booking error response:', error);
                throw new Error(error.error || error.message || 'Ошибка при создании бронирования');
            }

            const result = await response.json();

            return {
                bookingId: result.bookingId || result.id || Math.random().toString(36).substr(2, 9),
                message: result.message || 'Бронирование успешно создано'
            };
        } catch (error) {
            console.error('Ошибка при создании бронирования:', error);
            throw error;
        }
    }

    async getUserBookings(): Promise<Booking[]> {
        try {
            const response = await authService.makeAuthenticatedRequest(`${getApiUrl()}/booking/bookings`);

            if (!response.ok) {
                throw new Error('Ошибка при получении бронирований');
            }

            return await response.json();
        } catch (error) {
            console.warn('API unavailable', error);
            throw error;
        }
    }

    async getSessionSeats(sessionId: number): Promise<SessionSeatsResponse> {
        try {
            const response = await fetch(`${getApiUrl()}/showtimes/sessions/${sessionId}/seats`);

            if (!response.ok) {
                throw new Error('Ошибка при получении занятых мест');
            }

            return await response.json();
        } catch (error) {
            console.warn('API unavailable for session seats', error);
            // Возвращаем пустой массив вместо ошибки
            return { takenSeats: [] };
        }
    }

    createWebSocketConnection(sessionId: number): WebSocket | null {
        try {
            const wsUrl = `${getWsUrl()}/showtimes/session/${sessionId}`;
            console.log('Connecting to WebSocket:', wsUrl);

            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log(`WebSocket connected to session ${sessionId}`);
            };

            ws.onclose = (event) => {
                console.log(`WebSocket closed for session ${sessionId}:`, event.code, event.reason);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            return ws;
        } catch (error) {
            console.warn('WebSocket unavailable:', error);
            return null;
        }
    }
}

export const bookingService = new BookingService();
