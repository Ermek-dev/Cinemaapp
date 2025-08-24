import React, { useState, useEffect } from 'react';
import { sessionService, SessionFilters } from '../services/sessionService';
import { getMovies } from '../services/api';
import { hallService } from '../services/hallService';
import { Session } from '../types/session';
import { Movie } from '../types/movie';
import { Hall } from '../types/hall';

const UserSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<SessionFilters>({
    movieId: undefined,
    hallId: undefined,
    date: '',
  });

  // Загрузка фильтров: фильмы и залы
  useEffect(() => {
    async function loadFilterData() {
      try {
        const [moviesData, hallsData] = await Promise.all([
          getMovies(),
          hallService.getHalls(),
        ]);
        setMovies(moviesData);
        setHalls(hallsData);
      } catch (err) {
        console.error('Ошибка при загрузке фильтров:', err);
      }
    }
    loadFilterData();
  }, []);

  // Загрузка сеансов при изменении фильтров
  useEffect(() => {
    loadSessions();
  }, [filters]);

  async function loadSessions() {
    setLoading(true);
    setError(null);
    try {
      const data = await sessionService.getSessions(filters);
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить сеансы');
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(
      key: keyof SessionFilters,
      value: string | number | undefined
  ) {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  }

  function clearFilters() {
    setFilters({
      movieId: undefined,
      hallId: undefined,
      date: '',
    });
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

  function getMovieTitle(movieId: number) {
    const movie = movies.find((m) => m.id === movieId);
    return movie ? movie.title : `Фильм #${movieId}`;
  }

  function getHallName(hallId: number) {
    const hall = halls.find((h) => h.id === hallId);
    return hall ? hall.name : `Зал #${hallId}`;
  }

  function handleBookingClick(sessionId: number) {
    // Open seat booking page in new tab
    const url = `/sessions/${sessionId}/seats`;
    window.open(url, '_blank');
  }

  return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl text-cinema-gold hover:text-cinema-red transition-colors mb-8">
          Сеансы
        </h1>

        {/* Фильтры */}
        <div className="bg-cinema-dark rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Фильтры</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Фильтр по фильму */}
            <div>
              <label htmlFor="movieFilter" className="block text-sm font-medium text-white mb-2">
                Фильм
              </label>
              <select
                  id="movieFilter"
                  value={filters.movieId ?? ''}
                  onChange={(e) =>
                      handleFilterChange('movieId', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все фильмы</option>
                {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                ))}
              </select>
            </div>

            {/* Фильтр по залу */}
            <div>
              <label htmlFor="hallFilter" className="block text-sm font-medium text-white mb-2">
                Зал
              </label>
              <select
                  id="hallFilter"
                  value={filters.hallId ?? ''}
                  onChange={(e) =>
                      handleFilterChange('hallId', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все залы</option>
                {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.name}
                    </option>
                ))}
              </select>
            </div>

            {/* Фильтр по дате */}
            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-white mb-2">
                Дата
              </label>
              <input
                  type="date"
                  id="dateFilter"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Кнопка очистки фильтров */}
            <div className="flex items-end">
              <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>

        {/* Список сеансов */}
        <div className="bg-cinema-dark rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-white">Найдено сеансов: {sessions.length}</h2>
          </div>

          {loading && (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cinema-gold"></div>
                <p className="mt-2 text-gray-400">Загрузка сеансов...</p>
              </div>
          )}

          {error && (
              <div className="p-6 text-center text-red-600">
                <p>Ошибка: {error}</p>
                <button
                    onClick={loadSessions}
                    className="mt-2 px-4 py-2 bg-cinema-gold text-cinema-dark rounded-md hover:bg-yellow-400"
                >
                  Повторить
                </button>
              </div>
          )}

          {!loading && !error && sessions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>Сеансы не найдены</p>
              </div>
          )}

          {!loading && !error && sessions.length > 0 && (
              <div className="divide-y divide-gray-200">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className="p-6 hover:bg-gray-700 rounded-md"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {getMovieTitle(session.movieId)}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-400">
                            <p>
                              <span className="font-medium">Зал:</span> {getHallName(session.hallId)}
                            </p>
                            <p>
                              <span className="font-medium">Время:</span> {formatDateTime(session.startTime)}
                            </p>
                            <p>
                              <span className="font-medium">Цена:</span> {session.price} ₸
                            </p>
                          </div>
                        </div>
                        <div className="ml-4">
                          <button
                              className="bg-cinema-gold text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
                              onClick={() => handleBookingClick(session.id)}
                          >
                            Забронировать
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default UserSessions;
