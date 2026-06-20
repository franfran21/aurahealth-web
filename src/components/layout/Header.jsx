import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Heart, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  User, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export const Header = () => {
  const { token, userName, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const links = [
    { name: 'Dashboard', path: '/home', icon: Sparkles },
    { name: 'Chat con Luna', path: '/chat', icon: MessageSquare },
    { name: 'Calendario', path: '/calendario', icon: Calendar },
    { name: 'Registro Diario', path: '/registro-ciclo', icon: Heart },
    { name: 'Predicciones', path: '/predicciones', icon: TrendingUp },
    { name: 'Perfil', path: '/perfil', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-accent-pink/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={token ? '/home' : '/'} className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-xl font-bold shadow-md shadow-brand-primary/20 transition-transform group-hover:scale-105">
              A
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-text-primary">
              Aura<span className="text-brand-primary">Health+</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {token ? (
            <nav className="hidden md:flex space-x-1 lg:space-x-4 items-center">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'text-text-secondary hover:text-brand-primary hover:bg-brand-primary/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="h-6 w-px bg-accent-pink/30 mx-2" />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Salir</span>
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-text-secondary hover:text-brand-primary text-sm font-semibold transition-colors">
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                className="px-5 py-2.5 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryLight shadow-md shadow-brand-primary/10 hover:shadow-lg transition-all active:scale-95"
              >
                Comenzar gratis
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary hover:text-brand-primary focus:outline-none p-1.5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-accent-pink/10 px-2 pt-2 pb-4 space-y-1">
          {token ? (
            <>
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      active
                        ? 'bg-brand-primary text-white'
                        : 'text-text-secondary hover:text-brand-primary hover:bg-brand-primary/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="h-px bg-accent-pink/20 my-2 mx-4" />
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 px-4 py-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-accent-pink/30 text-text-secondary hover:text-brand-primary text-sm font-semibold transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryLight shadow-md transition-all"
              >
                Comenzar gratis
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
