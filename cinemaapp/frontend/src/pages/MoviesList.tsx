import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { getMovies } from '../services/api';
import { Movie } from '../types/movie';
import {X} from "lucide-react";

const MoviesList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>(''); // 🔍

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getMovies(search);
        setMovies(data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить фильмы. Пожалуйста, попробуйте позже.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [search]);

  const clearSearch = () => {
    setSearch('');
  };
  return (
      <div className="animate-fade-in min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-cinema-light">
            Сейчас в <span className="text-cinema-gold">кино</span>
          </h1>
          <p className="text-gray-400 mb-4">Выбирайте из нашей подборки фильмов</p>

          <div className="relative w-full md:w-[400px]">
            <input
                type="text"
                placeholder="Поиск по названию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cinema-gold"
            />
            {search && (
                <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    title="Очистить поиск"
                >
                  <X size={18}/>
                </button>
            )}
          </div>
        </div>

        {loading ? (
            <div className="flex justify-center items-center my-12">
              <Loader size="large"/>
            </div>
        ) : error ? (
            <ErrorMessage message={error}/>
        ) : movies.length === 0 ? (
            <div className="flex items-center justify-start">
              <p className="text-gray-500 col-span-full text-left">Фильмы не найдены.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
              ))}
            </div>
        )}
      </div>
  );
};

export default MoviesList;
