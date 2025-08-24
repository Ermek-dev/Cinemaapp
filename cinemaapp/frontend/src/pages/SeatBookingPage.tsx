import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionService } from '../services/sessionService';
import { getMovies } from '../services/api';
import { hallService } from '../services/hallService';
import { Session } from '../types/session';
import { Movie } from '../types/movie';
import { Hall } from '../types/hall';
import SeatBooking from '../components/SeatBooking';

const SeatBookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<Session | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [hall, setHall] = useState<Hall | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const sessionId = id ? parseInt(id, 10) : null;

    useEffect(() => {
        if (!sessionId) {
            setError('Неверный ID сеанса');
            setLoading(false);
            return;
        }

        loadSessionData();
    }, [sessionId]);

    async function loadSessionData() {
        if (!sessionId) return;

        try {
            setLoading(true);
            setError(null);

            // Load all sessions and find the specific one
            const sessions = await sessionService.getSessions();
            const currentSession = sessions.find(s => s.id === sessionId);

            if (!currentSession) {
                setError('Сеанс не найден');
                return;
            }

            setSession(currentSession);

            // Load movie and hall data
            const [moviesData, hallsData] = await Promise.all([
                getMovies(),
                hallService.getHalls(),
            ]);

            const sessionMovie = moviesData.find(m => m.id === currentSession.movieId);
            const sessionHall = hallsData.find(h => h.id === currentSession.hallId);

            setMovie(sessionMovie || null);
            setHall(sessionHall || null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка при загрузке данных сеанса');
        } finally {
            setLoading(false);
        }
    }

    function formatDateTime(dateTime: string) {
        return new Date(dateTime).toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function handleBookingComplete() {
        // Redirect back to sessions page after successful booking
        navigate('/sessions');
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cinema-gold"></div>
                    <p className="mt-4 text-gray-400">Загрузка данных сеанса...</p>
                </div>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-red-500 mb-4">{error || 'Сеанс не найден'}</p>
                    <button
                        onClick={() => navigate('/sessions')}
                        className="bg-cinema-gold text-cinema-dark px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        Вернуться к сеансам
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Session Info Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/sessions')}
                    className="text-cinema-gold hover:text-yellow-400 transition-colors mb-4 flex items-center gap-2"
                >
                    ← Вернуться к сеансам
                </button>

                <div className="bg-cinema-dark rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-cinema-gold mb-4">Бронирование мест</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                {movie?.title || `Фильм #${session.movieId}`}
                            </h2>
                            <div className="space-y-1 text-gray-400">
                                <p><span className="font-medium">Зал:</span> {hall?.name || `Зал #${session.hallId}`}</p>
                                <p><span className="font-medium">Время:</span> {formatDateTime(session.startTime)}</p>
                                <p><span className="font-medium">Цена:</span> {session.price} ₸</p>
                                {hall && (
                                    <p><span className="font-medium">Конфигурация:</span> {hall.rows} рядов, {hall.seatsPerRow} мест в ряду</p>
                                )}
                            </div>
                        </div>

                        {movie?.posterUrl && (
                            <div className="flex justify-end">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-24 h-36 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Seat Booking Component */}
            {session && (
                <SeatBooking
                    sessionId={sessionId}
                    hallId={session.hallId}
                    onBookingComplete={handleBookingComplete}
                />
            )}
        </div>
    );
};

export default SeatBookingPage;
