import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
       isOpen,
       title,
       message,
       onConfirm,
       onCancel,
    }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
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
                        <AlertTriangle className="text-yellow-400" size={24} />
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-gray-300">
                    <p>{message}</p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-600">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
