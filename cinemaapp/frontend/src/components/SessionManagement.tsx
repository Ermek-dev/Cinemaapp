import React, { useEffect, useState } from 'react';
import { sessionService } from '../services/sessionService';
import { Session, CreateSessionRequest } from '../types/session';
import { Hall } from '../types/hall';
import { Movie } from '../types/movie';
import { getMovies } from '../services/api';
import { hallService } from '../services/hallService';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import { CalendarPlus, Trash2, Edit, Clock, MapPin, Film, Coins, X, Check } from 'lucide-react';
import ConfirmModal from "./ConfirmModal.tsx";

const SessionManagement: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [halls, setHalls] = useState<Hall[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

    const [formData, setFormData] = useState<CreateSessionRequest>({
        movieId: 0,
        hallId: 0,
        startTime: '',
        price: 0
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [sessionsData, moviesData, hallsData] = await Promise.all([
                sessionService.getSessions(),
                getMovies(),
                hallService.getHalls()
            ]);
            setSessions(sessionsData);
            setMovies(moviesData);
            setHalls(hallsData);
            setError(null);
        } catch (err) {
            setError('Не удалось загрузить данные. Попробуйте позже.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getMovieTitle = (id: number) =>
        movies.find((movie) => movie.id === id)?.title || `Фильм ID ${id}`;

    const getHallName = (id: number) =>
        halls.find((hall) => hall.id === id)?.name || `Зал ID ${id}`;

    const resetForm = () => {
        setFormData({
            movieId: 0,
            hallId: 0,
            startTime: '',
            price: 0
        });
        setEditingSession(null);
        setShowCreateForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.movieId || !formData.hallId || !formData.startTime || !formData.price) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            if (editingSession) {
                await sessionService.updateSession(editingSession.id, formData);
                setSessions(prev => prev.map(s =>
                    s.id === editingSession.id
                        ? { ...s, ...formData }
                        : s
                ));
            } else {
                const result = await sessionService.createSession(formData);
                const newSession: Session = {
                    id: result.id,
                    ...formData
                };
                setSessions(prev => [...prev, newSession]);
            }
            resetForm();
        } catch (err: any) {
            alert(err.message || 'Ошибка при сохранении сеанса');
        }
    };

    const handleEdit = (session: Session) => {
        setEditingSession(session);
        setFormData({
            movieId: session.movieId,
            hallId: session.hallId,
            startTime: session.startTime,
            price: session.price
        });
        setShowCreateForm(true);
    };

    const handleDeleteClick = (session: Session) => {
        setSessionToDelete(session);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!sessionToDelete) return;

        try {
            await sessionService.deleteSession(sessionToDelete.id);
            await fetchAllData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка удаления сеанса');
        } finally {
            setSessionToDelete(null);
            setConfirmOpen(false);
        }
    };


    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString('ru-RU'),
            time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <Loader size="large" />
            </div>
        );
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Film className="w-8 h-8 text-cinema-gold" />
                    Управление сеансами
                </h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 bg-cinema-gold hover:bg-yellow-400 text-black font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                    <CalendarPlus className="w-5 h-5" />
                    Добавить сеанс
                </button>
            </div>

            {/* Create/Edit Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {editingSession ? 'Редактировать сеанс' : 'Новый сеанс'}
                            </h3>
                            <button
                                onClick={resetForm}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Film className="w-4 h-4 inline mr-2" />
                                    Фильм
                                </label>
                                <select
                                    value={formData.movieId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, movieId: Number(e.target.value) }))}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cinema-gold focus:outline-none"
                                    required
                                >
                                    <option value={0}>Выберите фильм</option>
                                    {movies.map(movie => (
                                        <option key={movie.id} value={movie.id}>
                                            {movie.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Зал
                                </label>
                                <select
                                    value={formData.hallId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, hallId: Number(e.target.value) }))}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cinema-gold focus:outline-none"
                                    required
                                >
                                    <option value={0}>Выберите зал</option>
                                    {halls.map(hall => (
                                        <option key={hall.id} value={hall.id}>
                                            {hall.name} ({hall.rows}x{hall.seatsPerRow} мест)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Clock className="w-4 h-4 inline mr-2" />
                                    Время начала
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cinema-gold focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Coins className="w-4 h-4 inline mr-2" />
                                    Цена билета (₸)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-cinema-gold focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-cinema-gold hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    {editingSession ? 'Сохранить' : 'Создать'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sessions List */}
            {sessions.length === 0 ? (
                <div className="text-center py-12">
                    <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Сеансов пока нет</p>
                    <p className="text-gray-500 text-sm mt-2">Добавьте первый сеанс, чтобы начать</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sessions.map((session) => {
                        const { date, time } = formatDateTime(session.startTime);
                        return (
                            <div
                                key={session.id}
                                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cinema-gold transition-colors duration-200"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-lg font-semibold text-white line-clamp-2">
                                            {getMovieTitle(session.movieId)}
                                        </h3>
                                        <div className="flex gap-2 ml-2">
                                            <button
                                                onClick={() => handleEdit(session)}
                                                className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                                title="Редактировать"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(session)}
                                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                                                title="Удалить"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-cinema-gold" />
                                            <span>{getHallName(session.hallId)}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-cinema-gold" />
                                            <span>{date} в {time}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Coins className="w-4 h-4 text-cinema-gold" />
                                            <span className="font-semibold text-white">{session.price} ₸</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Удалить сеанс"
                message={
                    sessionToDelete
                        ? `Вы уверены, что хотите удалить сеанс "${getMovieTitle(sessionToDelete.movieId)}" в зале "${getHallName(sessionToDelete.hallId)}" ${formatDateTime(sessionToDelete.startTime).date} в ${formatDateTime(sessionToDelete.startTime).time}?`
                        : ''
                }
                onCancel={() => {
                    setSessionToDelete(null);
                    setConfirmOpen(false);
                }}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default SessionManagement;
