import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {Film} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
      <div className="min-h-screen bg-cinema-dark">
        <nav className="bg-cinema-gray border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link to="/"
                      className="flex items-center gap-2 text-cinema-gold hover:text-cinema-red transition-colors">
                  <Film size={28}/>
                  <span className="text-xl font-heading font-bold">КиноБилет</span>
                </Link>
                <div className="flex space-x-6">
                  <Link
                      to="/sessions"
                      className="text-white hover:text-cinema-gold transition-colors"
                  >
                    Сеансы
                  </Link>
                  {isAuthenticated && (
                      <Link
                          to="/cabinet"
                          className="text-white hover:text-cinema-gold transition-colors"
                      >
                        Личный кабинет
                      </Link>
                  )}
                  {user?.role === 'admin' && (
                      <Link
                          to="/admin"
                          className="text-white hover:text-cinema-gold transition-colors"
                      >
                        Админ-панель
                      </Link>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <div className="flex items-center space-x-4">
                      <Link
                          to="/cabinet"
                          className="text-white hover:text-cinema-gold transition-colors"
                      >
                        {user?.email}
                      </Link>
                      <button
                          onClick={handleLogout}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Выйти
                      </button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                      <Link
                          to="/login"
                          className="bg-cinema-gold hover:bg-yellow-400 text-cinema-dark px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Войти
                      </Link>
                      <Link
                          to="/register"
                          className="border border-cinema-gold text-cinema-gold hover:bg-cinema-gold hover:text-cinema-dark px-4 py-2 rounded-lg transition-colors"
                      >
                        Регистрация
                      </Link>
                    </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow container-custom py-8">{children}</main>
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
