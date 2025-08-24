import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import HallManagement from '../components/HallManagement';
import SessionManagement from '../components/SessionManagement';
import { Building, Calendar, Film } from 'lucide-react';
import MovieManagement from "../components/MovieManagement.tsx";

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'movies' | 'halls' | 'sessions' | 'users' | 'analytics'>('movies');

    const tabs = [
        { id: 'movies' as const, label: 'Фильмы', icon: Film },
        { id: 'halls' as const, label: 'Залы', icon: Building },
        { id: 'sessions' as const, label: 'Сеансы', icon: Calendar },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-cinema-gold to-yellow-500 text-black p-6 rounded-lg">
                <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
                <p className="text-lg">{user?.email}</p>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700">
                <div className="border-b border-gray-700">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-cinema-gold text-cinema-gold'
                                            : 'border-transparent text-gray-400 hover:text-gray-300'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'movies' && <MovieManagement />}
                    {activeTab === 'halls' && <HallManagement />}
                    {activeTab === 'sessions' && <SessionManagement />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
