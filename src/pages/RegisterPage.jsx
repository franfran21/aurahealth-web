import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const code = username.trim();

    if (!code) {
      setLocalError('Crea un código para empezar.');
      return;
    }

    if (code.length < 3) {
      setLocalError('El código debe tener al menos 3 caracteres.');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
      setLocalError('Solo letras, números, guiones y underscores.');
      return;
    }

    const res = await register(code);
    if (res.success) {
      navigate('/onboarding');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background-primary/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-accent-rose items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-primary/20 mb-5">
          ✦
        </Link>
        <h2 className="font-serif text-4xl font-bold text-text-primary">
          Tu código exclusivo
        </h2>
        <p className="mt-2 text-sm text-text-secondary max-w-xs mx-auto">
          Crea un código personal. Sin correo, sin teléfono. Solo tú y Luna.
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
              <div className="relative inline-block">
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej: Luna2024"
                  className="w-64 bg-background-primary/40 border-2 border-dashed border-brand-primary/30 focus:border-brand-primary rounded-2xl px-5 py-4 text-lg font-bold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all uppercase placeholder:font-normal placeholder:tracking-normal placeholder:text-sm placeholder:text-text-secondary/30"
                  autoFocus
                  autoComplete="off"
                  maxLength={20}
                />
                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary/40 pointer-events-none" />
              </div>
              <p className="text-[10px] text-text-secondary/40 mt-2">
                Letras, números, guiones. Mínimo 3, máximo 20.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3.5 text-base font-semibold"
            >
              Crear mi espacio
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-text-secondary">
              ¿Ya tienes un código?{' '}
              <Link to="/login" className="font-semibold text-brand-primary hover:text-brand-primaryLight transition-colors">
                Entrar
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
            Tus datos solo existen en tu sesión. Sin spam, sin correos.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;