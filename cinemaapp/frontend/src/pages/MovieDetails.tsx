import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getMovieById } from '../services/api';
import { Movie } from '../types/movie';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getMovieById(id);
        
        if (!data) {
          setError('Фильм не найден');
          return;
        }
        
        setMovie(data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить информацию о фильме. Пожалуйста, попробуйте позже.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}мин`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader size="large" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="my-8">
        <Link to="/" className="flex items-center text-cinema-gold hover:text-cinema-red mb-4 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Назад к фильмам
        </Link>
        <ErrorMessage message={error || 'Фильм не найден'} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link to="/" className="flex items-center text-cinema-gold hover:text-cinema-red mb-4 transition-colors">
        <ArrowLeft size={20} className="mr-2" />
        Назад к фильмам
      </Link>
      
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={movie.posterUrl}
              alt={`${movie.title} постер`}
              className="w-full h-auto"
            />
          </div>
          
          <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-cinema-light">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-6 text-gray-300">
              <div className="flex items-center">
                <Clock className="mr-2 text-cinema-gold" size={18} />
                <span>{formatDuration(movie.duration)}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-cinema-gold">Описание</h2>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails