import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building } from 'lucide-react';
import {movieService} from "../services/movieService.ts";
import {CreateMovieRequest, Movie} from "../types/movie.ts";
import ConfirmModal from "./ConfirmModal.tsx";

const MovieManagement: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const [formData, setFormData] = useState<CreateMovieRequest>({
    title: '',
    description: '',
    duration: 1,
    posterUrl: '',
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await movieService.getAllMovies();
      setMovies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки фильмов');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingMovie) {
        await movieService.updateMovie(editingMovie.id, formData);
      } else {
        await movieService.createMovie(formData);
      }
      
      await loadMovies();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения фильма');
    }
  };

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;

    try {
      await movieService.deleteMovie(movieToDelete.id);
      await loadMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления фильма');
    } finally {
      setMovieToDelete(null);
      setConfirmOpen(false);
    }
  };


  const startEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      posterUrl: movie.posterUrl,
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 1,
      posterUrl: '' });
    setEditingMovie(null);
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cinema-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-cinema-gold flex items-center gap-2">
          <Building className="h-4 w-4" />
          Управление фильмами
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-cinema-gold text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить фильм
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingMovie ? 'Редактировать фильм' : 'Создать новый фильм'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Название фильма
              </label>
              <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                  placeholder="Введите название фильма"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Описание
                </label>
                <input
                    type="text"
                    required
                    min="1"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Длительность фильма
                </label>
                <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({
                      ...formData,
                      duration: Number(e.target.value),
                    })
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Ссылка на изображение постера
              </label>
              <input
                  type="text"
                  required
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({...formData, posterUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cinema-gold"
              />
            </div>

            <div className="flex gap-2">
              <button
                  type="submit"
                  className="bg-cinema-gold text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
              >
                {editingMovie ? 'Обновить' : 'Создать'}
              </button>
              <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {movies.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50"/>
              <p>Фильмы не найдены</p>
            </div>
        ) : (
            movies.map((movie) => (
                <div key={movie.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{movie.title}</h3>
                      <div className="text-gray-400 space-y-1">
                        <p>
                          <strong className="text-yellow-400">Описание:</strong> {movie.description}
                        </p>
                        <p>
                          <strong className="text-yellow-400">Длительность:</strong> {movie.duration} мин.
                        </p>
                        <p>
                          <strong className="text-yellow-400">Ссылка на изображение:</strong> {movie.posterUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                          onClick={() => startEdit(movie)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-md transition-colors"
                      >
                        <Edit className="h-4 w-4"/>
                      </button>
                      <button
                          onClick={() => handleDeleteClick(movie)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4"/>
                      </button>

                    </div>
                  </div>
                </div>
            ))
        )}
      </div>
      <ConfirmModal
          isOpen={confirmOpen}
          title="Удалить фильм"
          message={`Вы уверены, что хотите удалить фильм "${movieToDelete?.title}"?`}
          onCancel={() => {
            setMovieToDelete(null);
            setConfirmOpen(false);
          }}
          onConfirm={confirmDelete}
      />
    </div>
  );
};

export default MovieManagement;
