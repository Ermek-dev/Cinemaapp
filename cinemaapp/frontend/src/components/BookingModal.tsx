import React from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  bookingId?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
     isOpen,
     onClose,
     type,
     title,
     message,
     bookingId
   }) => {

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
      <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
      >
        <div className="bg-cinema-dark rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in border border-gray-600">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <div className="flex items-center space-x-3">
              {type === 'success' ? (
                  <CheckCircle className="text-green-500" size={24} />
              ) : (
                  <XCircle className="text-red-500" size={24} />
              )}
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
              {type === 'error' && (
                  <p className="text-gray-300 mb-4">{message}</p>
              )}
            {bookingId && (
                <div className="bg-cinema-gray p-4">
                  <p className="text-cinema-gold font-semibold text-sm mb-1">
                    ID бронирования:
                  </p>
                  <p className="text-white font-mono text-lg">{bookingId}</p>
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-600">
            <button
                onClick={onClose}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    type === 'success'
                        ? 'bg-cinema-gold text-cinema-dark hover:bg-yellow-400'
                        : 'bg-red-600 text-white hover:bg-red-700'
                }`}
            >
              Понятно
            </button>
          </div>
        </div>
      </div>
  );
};

export default BookingModal;
