import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A0A10] text-white/70 py-12 mt-auto border-t border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo / Brand info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-base font-bold">
                A
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Aura<span className="text-accent-pink">Health+</span>
              </span>
            </div>
            <p className="text-sm text-white/50 max-w-xs">
              Tu equilibrio hormonal es nuestra ciencia. Una plataforma de salud femenina guiada por inteligencia artificial.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-2">Enlaces rápidos</h4>
            <Link to="/" className="text-sm hover:text-accent-pink transition-colors">Inicio</Link>
            <Link to="/login" className="text-sm hover:text-accent-pink transition-colors">Iniciar Sesión</Link>
            <Link to="/registro" className="text-sm hover:text-accent-pink transition-colors">Registro de Ciclo</Link>
          </div>

          {/* Credits */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-white text-sm tracking-wider uppercase mb-2">Proyecto AuraHealth+</h4>
            <p className="text-sm">
              Desarrollado y firmado por: <strong className="text-white">Francys Alvarado</strong>
            </p>
            <p className="text-sm text-white/40">
              Ubicación: España
            </p>
          </div>
        </div>

        <div className="h-px bg-white/10 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {currentYear} AuraHealth+. Todos los derechos reservados.</p>
          <p>Luna AI Ecosystem v1.5.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
