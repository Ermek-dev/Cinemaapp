import React, { useState, useEffect } from 'react';
import { Hall, CreateHallRequest } from '../types/hall';
import { hallService } from '../services/hallService';
import { Plus, Edit, Trash2, Building } from 'lucide-react';
import ConfirmModal from "./ConfirmModal.tsx";

const HallManagement: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hallToDelete, setHallToDelete] = useState<Hall | null>(null);

  const [formData, setFormData] = useState<CreateHallRequest>({
    name: '',
    rows: 1,
    seatsPerRow: 1,
  });

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    try {
      setLoading(true);
      const data = await hallService.getHalls();
      setHalls(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки залов');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingHall) {
        await hallService.updateHall(editingHall.id, formData);
      } else {
        await hallService.createHall(formData);
      }
      
      await loadHalls();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения зала');
    }
  };

  const handleDeleteClick = (hall: Hall) => {
    setHallToDelete(hall);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!hallToDelete) return;

    try {
      await hallService.deleteHall(hallToDelete.id);
      await loadHalls();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления зала');
    } finally {
      setHallToDelete(null);
      setConfirmOpen(false);
    }
  };

  const startEdit = (hall: Hall) => {
    setEditingHall(hall);
    setFormData({
      name: hall.name,
      rows: hall.rows,
      seatsPerRow: hall.seatsPerRow,
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', rows: 1, seatsPerRow: 1 });
    setEditingHall(null);
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
          Управление залами
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-cinema-gold text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить зал
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
            {editingHall ? 'Редактировать зал' : 'Создать новый зал'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Название зала
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                placeholder="Введите название зала"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Количество рядов
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.rows}
                  onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Мест в ряду
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.seatsPerRow}
                  onChange={(e) => setFormData({ ...formData, seatsPerRow: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cinema-gold"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-cinema-gold text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
              >
                {editingHall ? 'Обновить' : 'Создать'}
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
        {halls.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Залы не найдены</p>
          </div>
        ) : (
          halls.map((hall) => (
            <div key={hall.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{hall.name}</h3>
                  <div className="text-gray-400 space-y-1">
                    <p>Рядов: {hall.rows}</p>
                    <p>Мест в ряду: {hall.seatsPerRow}</p>
                    <p>Всего мест: {hall.rows * hall.seatsPerRow}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(hall)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-md transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(hall)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmModal
          isOpen={confirmOpen}
          title="Удалить зал"
          message={`Вы уверены, что хотите удалить зал "${hallToDelete?.name}"?`}
          onCancel={() => {
            setHallToDelete(null);
            setConfirmOpen(false);
          }}
          onConfirm={confirmDelete}
      />
    </div>
  );
};

export default HallManagement;
