import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setLocalError('Por favor, completa todos los campos.');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setLocalError('Ingresa un correo electrónico válido.');
      return;
    }

    if (password !== confirm) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const res = await register(name.trim(), email.trim(), password);
    if (res.success) {
      navigate('/onboarding');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background-primary/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex w-12 h-12 rounded-full bg-brand-primary items-center justify-center text-white text-2xl font-bold shadow-md shadow-brand-primary/20 mb-4">
          A
        </Link>
        <h2 className="font-serif text-3xl font-bold text-text-primary">
          Únete a Aura
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Comienza tu viaje personalizado hacia el equilibrio.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-accent-pink/10 shadow-xl rounded-3xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Display errors */}
            {(error || localError) && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-2.5 text-xs text-red-700 animate-fade-in">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500" />
                <span className="font-medium">{localError || error}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                Nombre de usuario
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-background-primary/30 border border-gray-200 focus:border-brand-primary/45 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full bg-background-primary/30 border border-gray-200 focus:border-brand-primary/45 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-background-primary/30 border border-gray-200 focus:border-brand-primary/45 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary/50 hover:text-brand-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5 ml-1">
                Confirmar Contraseña
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                className="w-full bg-background-primary/30 border border-gray-200 focus:border-brand-primary/45 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-3.5 text-base font-semibold"
              >
                Crear Cuenta
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-semibold text-brand-primary hover:text-brand-primaryLight hover:underline transition-all">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
