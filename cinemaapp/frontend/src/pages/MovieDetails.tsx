import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {getMovieById, getMovies} from '../services/api';
import { Movie } from '../types/movie';
import {Session} from "../types/session.ts";
import {sessionService} from "../services/sessionService.ts";
import {Hall} from "../types/hall.ts";
import {hallService} from "../services/hallService.ts";
import SeatBooking from "../components/SeatBooking.tsx";

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const [movieData, hallsData] = await Promise.all([
          getMovieById(id),
          hallService.getHalls(),
        ]);
        setMovie(movieData);
        setHalls(hallsData);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);
  const selectedSession = Array.isArray(sessions)
      ? sessions.find((s) => s.id === selectedSessionId)
      : null;

  useEffect(() => {
    loadSessions();
  }, [id]);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sessionService.getSessions({ movieId: Number(id) }); // только movieId
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };
  function getHallName(hallId: number) {
    const hall = halls.find((h) => h.id === hallId);
    return hall ? hall.name : `Зал #${hallId}`;
  }


  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cinema-gold"></div>
        </div>
    );
  }

  if (!movie) {
    return (
        <div className="min-h-screen bg-cinema-dark text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Фильм не найден</h1>
            <Link
                to="/"
                className="bg-cinema-gold text-cinema-dark px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Вернуться к списку фильмов
            </Link>
          </div>
        </div>
    );
  }

  const handleBookingComplete = () => {
    setSelectedSessionId(null);
    // Optionally refresh sessions or show success message
  };

  return (
      <div className="min-h-screen bg-cinema-dark text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Movie Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold mb-4 text-cinema-gold">
                  {movie.title}
                </h1>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-gray-400">Жанр:</span>
                    <span className="ml-2">{movie.genre}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Длительность:</span>
                    <span className="ml-2">{movie.duration} мин</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Рейтинг:</span>
                    <span className="ml-2 text-cinema-gold">★ {movie.rating}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Год:</span>
                    <span className="ml-2">{movie.releaseYear}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Описание</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                </div>
              </div>
            </div>

            {/* Sessions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-cinema-gold">Расписание сеансов</h2>

              {!sessions || sessions.length === 0 ? (
                  <div className="bg-cinema-gray rounded-lg p-6 text-center">
                    <p className="text-gray-400">На данный момент нет доступных сеансов для этого фильма</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`bg-cinema-gray rounded-lg p-4 border-2 transition-all cursor-pointer ${
                                selectedSessionId === session.id
                                    ? 'border-cinema-gold'
                                    : 'border-transparent hover:border-gray-600'
                            }`}
                            onClick={() => setSelectedSessionId(session.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-semibold">
                                {new Date(session.startTime).toLocaleDateString('ru-RU')}
                              </p>
                              <p className="text-cinema-gold text-lg font-bold">
                                {new Date(session.startTime).toLocaleTimeString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">Зал {getHallName(session.hallId)}</p>
                              <p className="text-cinema-gold font-semibold">{session.price} ₸</p>
                            </div>
                          </div>

                          {selectedSessionId === session.id && (
                              <div className="mt-3 pt-3 border-t border-gray-600">
                                <p className="text-sm text-cinema-gold">
                                  ✓ Выбран для бронирования
                                </p>
                              </div>
                          )}
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {/* Seat Booking */}
            {selectedSessionId && (
                <SeatBooking
                    sessionId={selectedSessionId}
                    hallId={selectedSession.hallId}
                    onBookingComplete={handleBookingComplete}
                />
            )}
          </div>
        </div>
      </div>
  );
};

export default MovieDetails;
