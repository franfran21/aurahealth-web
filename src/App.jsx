import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import CalendarPage from './pages/CalendarPage';
import CycleLogPage from './pages/CycleLogPage';
import PredictionsPage from './pages/PredictionsPage';
import ProfilePage from './pages/ProfilePage';
import { Info, X } from 'lucide-react';

// Wrapper for protecting private routes
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Global handlers helper component to access router context
const GlobalEventHandlers = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // 1. Manejo de desautorización 401
    const handleUnauthorized = () => {
      logout();
      navigate('/login');
    };

    // 2. Manejo de cold start en Render
    const handleColdStart = (e) => {
      setToastMessage(e.detail?.message || 'Luna está despertando... espera un momento 🌙');
      setTimeout(() => setToastMessage(''), 8000); // Ocultar después de 8 segundos
    };

    window.addEventListener('aura-unauthorized', handleUnauthorized);
    window.addEventListener('aura-cold-start', handleColdStart);

    return () => {
      window.removeEventListener('aura-unauthorized', handleUnauthorized);
      window.removeEventListener('aura-cold-start', handleColdStart);
    };
  }, [logout, navigate]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border border-accent-pink/30 rounded-2xl p-4 shadow-2xl flex items-start gap-3 text-text-primary animate-slide-in">
      <div className="w-8 h-8 rounded-full bg-accent-pink/20 flex items-center justify-center text-brand-primary flex-shrink-0 animate-pulse">
        🌙
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-xs text-brand-primary uppercase tracking-wider">Aviso del Servidor</h4>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{toastMessage}</p>
      </div>
      <button 
        onClick={() => setToastMessage('')} 
        className="text-text-secondary/40 hover:text-text-secondary p-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-background-primary">
        {/* Global listener component inside router context */}
        <GlobalEventHandlers />
        
        <Header />
        
        <main className="flex-1 flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={token ? <Navigate to="/home" replace /> : <LandingPage />} 
            />
            <Route 
              path="/login" 
              element={token ? <Navigate to="/home" replace /> : <LoginPage />} 
            />
            <Route 
              path="/registro" 
              element={token ? <Navigate to="/home" replace /> : <RegisterPage />} 
            />

            {/* Protected Routes */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendario" 
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/registro-ciclo" 
              element={
                <ProtectedRoute>
                  <CycleLogPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/predicciones" 
              element={
                <ProtectedRoute>
                  <PredictionsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
