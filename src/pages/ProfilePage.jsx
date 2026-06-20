import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { User, LogOut, Settings, Bell, Shield, Heart, Award } from 'lucide-react';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { userName, logout } = useAuthStore();
  const [stats, setStats] = useState({
    cycleLength: '28',
    healthScore: '85%',
    habitsCount: '12',
  });

  const handleLogout = () => {
    if (window.confirm('¿Estás segura de que deseas cerrar sesión?')) {
      logout();
      navigate('/');
    }
  };

  const accountItems = [
    { name: 'Mi Perfil Hormonal', desc: 'Edita tus datos antropométricos y objetivos de salud', icon: Heart },
    { name: 'Notificaciones', desc: 'Configura recordatorios de periodo y diario de síntomas', icon: Bell },
    { name: 'Seguridad', desc: 'Gestiona tu contraseña y credenciales de acceso', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/60">Ajustes</span>
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-text-primary mt-1">
          Mi Perfil
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* User Card & Stats */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-white border border-accent-pink/15 shadow-sm p-6 text-center flex flex-col items-center">
            {/* Avatar wrapper */}
            <div className="w-24 h-24 rounded-full bg-accent-pink/30 flex items-center justify-center border border-accent-pink/20 text-brand-primary mb-4 shadow-inner">
              <User className="w-12 h-12" />
            </div>
            
            <h2 className="font-serif text-xl font-bold text-text-primary">
              {userName}
            </h2>
            
            <span className="text-xs font-semibold text-brand-primary flex items-center gap-1 mt-1">
              <Award className="w-4 h-4 text-brand-primary" />
              Premium Member
            </span>
          </Card>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: stats.cycleLength, label: 'Días Ciclo' },
              { value: stats.healthScore, label: 'Salud' },
              { value: stats.habitsCount, label: 'Hábitos' },
            ].map((stat, idx) => (
              <Card key={idx} className="bg-white border border-accent-pink/10 p-4 text-center flex flex-col justify-center items-center shadow-sm">
                <span className="text-lg font-bold text-brand-primary">{stat.value}</span>
                <span className="text-[10px] text-text-secondary/55 font-bold uppercase tracking-wider mt-0.5">{stat.label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Account Details & Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white border border-accent-pink/15 shadow-sm p-6">
            <h3 className="font-serif text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-primary" />
              Configuración de la Cuenta
            </h3>

            <div className="space-y-4">
              {accountItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    className="w-full text-left flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-brand-primary/20 hover:bg-background-primary/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent-pink/20 text-brand-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-text-secondary/70 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 font-bold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
