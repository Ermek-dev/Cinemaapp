import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types/booking';
import {Movie} from "../types/movie.ts";
import {Session} from "../types/session.ts";
import {getMovies} from "../services/api.ts";
import {sessionService} from "../services/sessionService.ts";
import {Hall} from "../types/hall.ts";
import {hallService} from "../services/hallService.ts";

const UserCabinet: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [halls, setHalls] = useState<Hall[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userBookings, fetchedMovies, fetchedSessions,hallsData] = await Promise.all([
                    bookingService.getUserBookings(),
                    getMovies(),
                    sessionService.getSessions(),
                    hallService.getHalls(),
                ]);
                setBookings(userBookings);
                setMovies(fetchedMovies);
                setSessions(fetchedSessions);
                setHalls(hallsData);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getMovieTitle = (sessionId: number) => {
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return 'Неизвестный фильм';

        const movie = movies.find(m => m.id === session.movieId);
        return movie?.title || 'Неизвестный фильм';
    };

    function getHallName(hallId: number) {
        const hall = halls.find((h) => h.id === hallId);
        return hall ? hall.name : `Зал #${hallId}`;
    }

    const getSessionDetails = (sessionId: number) => {
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return { startTime: 'Неизвестно', price: 0 };

        return {
            startTime: new Date(session.startTime).toLocaleString('ru-RU'),
            price: session.price,
        };
    };

    const formatSeats = (seats: { row: number; seat: number }[]) => {
        return seats.map(seat => `Ряд ${seat.row}, Место ${seat.seat}`).join(', ');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cinema-gold"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cinema-dark text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-cinema-gold">
                        Личный кабинет
                    </h1>

                    <div className="bg-cinema-gray rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Информация о пользователе</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-gray-400">Email:</span>
                                <span className="ml-2 text-white">{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-cinema-gray rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Мои бронирования</h2>

                        {error && (
                            <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        {bookings.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-lg mb-4">
                                    У вас пока нет бронирований
                                </div>
                                <p className="text-gray-500">
                                    Выберите фильм и забронируйте места для просмотра
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => {
                                    const sessionDetails = getSessionDetails(booking.sessionId);
                                    const session = sessions.find(s => s.id === booking.sessionId);
                                    return (
                                        <div
                                            key={booking.id}
                                            className="border border-gray-600 rounded-lg p-4 hover:border-cinema-gold transition-colors"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-cinema-gold mb-1">
                                                        {getMovieTitle(booking.sessionId)}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        Бронирование #{booking.id}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-400">Дата и время</p>
                                                    <p className="text-white">{sessionDetails.startTime}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Зал:</p>
                                                    <p className="text-white">{getHallName(session.hallId)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Места</p>
                                                    <p className="text-white">{formatSeats(booking.seats)}</p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-400">Стоимость</p>
                                                    <p className="text-cinema-gold font-semibold">
                                                        {sessionDetails.price * booking.seats.length} ₸
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-gray-600">
                                                <p className="text-xs text-gray-500">
                                                    Забронировано: {new Date(booking.createdAt).toLocaleString('ru-RU')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCabinet;
