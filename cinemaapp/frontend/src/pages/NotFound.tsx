import React from 'react';
import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 text-cinema-gold">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">Страница не найдена</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 btn-primary"
      >
        <MoveLeft size={18} />
        На главную
      </Link>
    </div>
  );
};

export default NotFound;