import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldAlert, LogIn, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const code = username.trim();
    if (!code) {
      setLocalError('Ingresa tu código para continuar.');
      return;
    }

    const res = await login(code);
    if (res.success) {
      navigate('/home');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background-primary/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-rose to-brand-primary items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-primary/20 mb-5">
          🌙
        </Link>
        <h2 className="font-serif text-4xl font-bold text-text-primary">
          Bienvenida de vuelta
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Ingresa tu código personal para continuar.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white py-10 px-6 border border-accent-pink/10 shadow-xl rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(error || localError) && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-2.5 text-xs text-red-700">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500" />
                <span className="font-medium">{localError || error}</span>
              </div>
            )}

            <div className="text-center">
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu código"
                className="w-64 bg-background-primary/40 border-2 border-brand-primary/20 focus:border-brand-primary rounded-2xl px-5 py-4 text-lg font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-sm placeholder:text-text-secondary/30"
                autoFocus
                autoComplete="off"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3.5 text-base font-semibold"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-text-secondary">
              ¿No tienes código?{' '}
              <Link to="/registro" className="font-semibold text-brand-primary hover:text-brand-primaryLight transition-colors">
                Crear uno gratis
              </Link>
            </p>
            <p className="text-xs text-text-secondary/50">
              <Link to="/home?guest=1" className="hover:text-brand-primary transition-colors">
                O explorar sin registro →
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-pink/15 text-brand-primary text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Tu código es tu llave. Privacidad total.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;