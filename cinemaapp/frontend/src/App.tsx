import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import MoviesList from './pages/MoviesList';
import MovieDetails from './pages/MovieDetails';
import UserSessions from './pages/UserSessions';
import UserCabinet from './pages/UserCabinet';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import HallManagement from './components/HallManagement';
import SessionManagement from './components/SessionManagement';
import SeatBookingPage from './pages/SeatBookingPage';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* Public routes - accessible to all users */}
                <Route
                    path="/"
                    element={
                        <Layout>
                            <MoviesList />
                        </Layout>
                    }
                />
                <Route
                    path="/movies/:id"
                    element={
                        <Layout>
                            <MovieDetails />
                        </Layout>
                    }
                />
                <Route
                    path="/sessions"
                    element={
                        <Layout>
                            <UserSessions />
                        </Layout>
                    }
                />
                <Route
                    path="/sessions/:id/seats"
                    element={
                        <Layout>
                            <SeatBookingPage />
                        </Layout>
                    }
                />

                {/* Protected routes - require authentication */}
                <Route
                    path="/cabinet"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <UserCabinet />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin routes - require admin role */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <Layout>
                                <AdminDashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/movies"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <Layout>
                                <MoviesList />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/halls"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <Layout>
                                <HallManagement />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/sessions"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <Layout>
                                <SessionManagement />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
