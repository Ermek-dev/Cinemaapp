import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';
import { hallService } from '../services/hallService';
import { Seat, WebSocketSeatUpdate } from '../types/booking';
import { Hall } from '../types/hall';
import BookingModal from './BookingModal';

interface SeatBookingProps {
    sessionId: number;
    hallId: number;
    onBookingComplete?: () => void;
}

const SeatBooking: React.FC<SeatBookingProps> = ({ sessionId, hallId, onBookingComplete }) => {
    const { isAuthenticated } = useAuth();
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [takenSeats, setTakenSeats] = useState<Seat[]>([]);
    const [hall, setHall] = useState<Hall | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);

    // Modal state
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
        bookingId?: string;
    }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
    });

    useEffect(() => {
        loadHallData();
        loadTakenSeats();
        setupWebSocket();

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [sessionId, hallId]);

    const loadHallData = async () => {
        try {
            const halls = await hallService.getHalls();
            const currentHall = halls.find(h => h.id === hallId);

            if (currentHall) {
                setHall(currentHall);
            } else {
                setError('Зал не найден');
            }
        } catch (err) {
            console.error('Error loading hall data:', err);
            setError('Ошибка при загрузке данных зала');
        }
    };

    const loadTakenSeats = async () => {
        try {
            const response = await bookingService.getSessionSeats(sessionId);
            setTakenSeats(response.takenSeats);
        } catch (err) {
            console.error('Error loading taken seats:', err);
            // Не показываем ошибку пользователю, просто логируем
        }
    };

    const setupWebSocket = () => {
        const websocket = bookingService.createWebSocketConnection(sessionId);
        if (websocket) {
            websocket.onmessage = (event) => {
                try {
                    const data: WebSocketSeatUpdate = JSON.parse(event.data);
                    if (data.type === 'seat_update' && data.sessionId === sessionId) {
                        setTakenSeats(data.takenSeats);
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };
            setWs(websocket);
        }
    };

    const isSeatTaken = (row: number, seat: number) => {
        return takenSeats.some(takenSeat => takenSeat.row === row && takenSeat.seat === seat);
    };

    const isSeatSelected = (row: number, seat: number) => {
        return selectedSeats.some(selectedSeat => selectedSeat.row === row && selectedSeat.seat === seat);
    };

    const toggleSeat = (row: number, seat: number) => {
        if (!isAuthenticated) {
            setError('Для бронирования мест необходимо войти в систему');
            return;
        }

        if (isSeatTaken(row, seat)) {
            return; // Can't select taken seats
        }

        const seatObj = { row, seat };
        const isCurrentlySelected = isSeatSelected(row, seat);

        if (isCurrentlySelected) {
            setSelectedSeats(prev => prev.filter(s => !(s.row === row && s.seat === seat)));
        } else {
            setSelectedSeats(prev => [...prev, seatObj]);
        }
        setError(null);
    };

    const showModal = (type: 'success' | 'error', title: string, message: string, bookingId?: string) => {

        setModalState({
            isOpen: true,
            type,
            title,
            message,
            bookingId,
        });
    };

    const closeModal = () => {
        setModalState(prev => {
            const wasSuccess = prev.type === 'success';
            const newState = { ...prev, isOpen: false };

            if (wasSuccess && onBookingComplete) {
                onBookingComplete();
            }

            return newState;
        });
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            setError('Для бронирования мест необходимо войти в систему');
            return;
        }

        if (selectedSeats.length === 0) {
            setError('Выберите места для бронирования');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await bookingService.createBooking({
                sessionId,
                seats: selectedSeats,
            });

            // Показываем модальное окно успеха
            showModal(
                'success',
                'Бронирование успешно!',
                response.message || 'Ваши места успешно забронированы',
                response.bookingId?.toString() || 'N/A'
            );

            // Clear selected seats
            setSelectedSeats([]);

            // Reload taken seats
            await loadTakenSeats();

        } catch (err) {
            console.error('Booking error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Ошибка при бронировании';
            showModal(
                'error',
                'Ошибка бронирования',
                errorMessage
            );
        } finally {
            setLoading(false);
        }
    };

    const getSeatClass = (row: number, seat: number) => {
        const baseClass = 'w-8 h-8 m-1 rounded-md border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-semibold';

        if (isSeatTaken(row, seat)) {
            return `${baseClass} bg-red-600 border-red-600 cursor-not-allowed text-white`;
        }

        if (isSeatSelected(row, seat)) {
            return `${baseClass} bg-cinema-gold border-cinema-gold text-cinema-dark hover:bg-yellow-400`;
        }

        return `${baseClass} bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500`;
    };

    if (!hall) {
        return (
            <div className="bg-cinema-gray rounded-lg p-6">
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cinema-gold"></div>
                    <p className="mt-4 text-gray-400">Загрузка конфигурации зала...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-cinema-gray rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6 text-cinema-gold">
                    Выбор мест - {hall.name}
                </h3>

                {/* Screen */}
                <div className="mb-8">
                    <div className="w-full h-4 bg-gradient-to-r from-transparent via-cinema-gold to-transparent rounded-full mb-2"></div>
                    <p className="text-center text-gray-400 text-sm">ЭКРАН</p>
                </div>

                {/* Seat Map */}
                <div className="mb-6">
                    {Array.from({ length: hall.rows }, (_, rowIndex) => {
                        const rowNumber = rowIndex + 1;
                        return (
                            <div key={rowNumber} className="flex items-center justify-center mb-2">
                                <div className="w-8 text-center text-gray-400 text-sm mr-4">
                                    {rowNumber}
                                </div>
                                <div className="flex">
                                    {Array.from({ length: hall.seatsPerRow }, (_, seatIndex) => {
                                        const seatNumber = seatIndex + 1;
                                        return (
                                            <button
                                                key={seatNumber}
                                                className={getSeatClass(rowNumber, seatNumber)}
                                                onClick={() => toggleSeat(rowNumber, seatNumber)}
                                                disabled={isSeatTaken(rowNumber, seatNumber) || loading}
                                                title={`Ряд ${rowNumber}, Место ${seatNumber}`}
                                            >
                                                {seatNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex justify-center space-x-6 mb-6 text-sm">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-700 border-2 border-gray-600 rounded mr-2"></div>
                        <span className="text-gray-400">Свободно</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-cinema-gold border-2 border-cinema-gold rounded mr-2"></div>
                        <span className="text-gray-400">Выбрано</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-600 border-2 border-red-600 rounded mr-2"></div>
                        <span className="text-gray-400">Занято</span>
                    </div>
                </div>

                {/* Selected Seats Info */}
                {selectedSeats.length > 0 && (
                    <div className="mb-4 p-4 bg-cinema-dark rounded-lg">
                        <p className="text-cinema-gold font-semibold mb-2">
                            Выбранные места ({selectedSeats.length}):
                        </p>
                        <p className="text-white">
                            {selectedSeats.map(seat => `Ряд ${seat.row}, Место ${seat.seat}`).join('; ')}
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">
                        {error}
                    </div>
                )}

                {/* Booking Button */}
                {isAuthenticated ? (
                    <button
                        onClick={handleBooking}
                        disabled={selectedSeats.length === 0 || loading}
                        className="w-full bg-cinema-gold text-cinema-dark font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Бронирование...' : `Забронировать места (${selectedSeats.length})`}
                    </button>
                ) : (
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-400 mb-3">
                            Для бронирования мест необходимо войти в систему
                        </p>
                        <a
                            href="/login"
                            className="inline-block bg-cinema-gold text-cinema-dark font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            Войти
                        </a>
                    </div>
                )}
            </div>

            {/* Booking Modal - всегда рендерим */}
            <BookingModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                bookingId={modalState.bookingId}
            />
        </>
    );
};

export default SeatBooking;
