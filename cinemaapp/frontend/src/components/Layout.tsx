import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-cinema-dark border-b border-gray-800 sticky top-0 z-10">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-cinema-gold hover:text-cinema-red transition-colors">
              <Film size={28} />
              <span className="text-xl font-heading font-bold">КиноБилет</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container-custom py-8">
        {children}
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-cinema-gold text-lg font-bold mb-4">КиноБилет</h3>
              <p className="text-gray-400">
                Самый простой способ купить билеты в кино. Бронируйте билеты онлайн.
              </p>
            </div>
            <div>
              <h3 className="text-cinema-gold text-lg font-bold mb-4">Контакты</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@kinobilet.kz</li>
                <li>Телефон: +7 (727) 223-45-67</li>
                <li>Адрес: ул. Абая, 123, Алматы</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} КиноБилет. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;