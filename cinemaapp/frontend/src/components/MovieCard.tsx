import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}мин`;
  };

  return (
    <div className="movie-card group animate-fade-in">
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={movie.posterUrl}
          alt={`${movie.title} постер`}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="text-white">
            <div className="flex items-center mb-2">
              <Clock size={16} className="mr-1 text-cinema-gold" />
              <span className="text-sm">{formatDuration(movie.duration)}</span>
            </div>
            <p className="text-sm line-clamp-2">{movie.description}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.title}</h3>
        <div className="flex justify-end mt-2">
          <Link to={`/movies/${movie.id}`} className="btn-primary py-1 px-4 text-sm">
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard