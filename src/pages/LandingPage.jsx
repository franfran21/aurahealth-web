import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Heart, ShieldAlert, ArrowRight, MessageCircle, Eye, UserPlus } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-accent-pink/35 to-background-primary pt-20 pb-24 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-accent-pink/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/25 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6 animate-pulse-soft">
            <Sparkles className="w-3.5 h-3.5" />
            Salud Femenina inteligente
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-extrabold text-text-primary tracking-tight leading-[1.1] mb-6">
            Sincroniza con tu <br />
            <span className="text-brand-primary">ritmo natural</span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
            AuraHealth+ fusiona el seguimiento hormonal clínico con el poder de Luna, tu asistente de IA, para ofrecerte análisis precisos y acompañamiento en cada fase de tu ciclo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/registro"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-primary text-white font-semibold text-lg hover:bg-brand-primaryLight shadow-lg shadow-brand-primary/10 hover:shadow-xl hover:shadow-brand-primary/20 transition-all active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              Crear mi código gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full border-2 border-brand-primary text-brand-primary font-semibold text-lg hover:bg-brand-primary/5 transition-all"
            >
              Ya tengo código
            </Link>
          </div>
          <div className="mt-6">
            <Link
              to="/home?guest=1"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary/50 hover:text-brand-primary transition-colors group"
            >
              <Eye className="w-4 h-4" />
              <span className="border-b border-dotted border-text-secondary/20 group-hover:border-brand-primary/30">Explorar sin registro — experiencia limitada</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Luna Section */}
      <section className="py-20 bg-white border-y border-accent-pink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual concept */}
            <div className="bg-gradient-to-tr from-accent-pink/30 to-brand-primary/5 p-12 rounded-3xl border border-accent-pink/10 relative overflow-hidden flex flex-col justify-center items-center h-[340px] text-center shadow-inner">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent-pink/40 blur-xl pointer-events-none" />
              <span className="text-5xl mb-4 select-none animate-bounce" style={{ animationDuration: '3s' }}>🌙</span>
              <div className="bg-white/80 backdrop-blur-md border border-accent-pink/20 rounded-2xl p-5 max-w-sm shadow-md">
                <p className="text-sm font-medium text-text-primary italic leading-relaxed">
                  "Hola, soy Luna. Estoy aquí para ayudarte a interpretar tus fluctuaciones de energía, humor y síntomas a lo largo del ciclo..."
                </p>
                <span className="text-xs text-brand-primary font-bold mt-2 block">— Luna, Tu Guía Hormonal</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-6">
                Conoce a <span className="text-brand-primary">Luna</span>, tu copiloto de bienestar
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                Luna no es un chatbot tradicional. Entrenada para comprender la endocrinología femenina y sincronizar con tus logs diarios, Luna te explica de manera cálida y científica qué está ocurriendo en tu cuerpo.
              </p>
              <ul className="space-y-4">
                {[
                  'Streaming de chat interactivo y fluido.',
                  'Análisis hormonales diarios basados en tus síntomas.',
                  'Consejos clínicos y nutricionales accionables por fase.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-text-secondary font-semibold">
                    <span className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background-primary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Herramientas diseñadas para ti
            </h2>
            <p className="text-text-secondary">
              Todo lo que necesitas para mapear, entender y predecir tu ciclo en una sola interfaz premium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                title: 'Chat Clínico con IA',
                desc: 'Consulta a Luna sobre dolores, cambios de humor o recomendaciones de bienestar instantáneas.',
                icon: MessageCircle,
                color: 'bg-accent-pink/30 text-brand-primary',
              },
              {
                title: 'Calendario de Fases',
                desc: 'Mapea de forma clara la menstruación, ovulación y las ventanas fértiles con códigos de color.',
                icon: Calendar,
                color: 'bg-accent-purple/10 text-accent-purple',
              },
              {
                title: 'Predicciones Avanzadas',
                desc: 'Visualiza gráficos interactivos de probabilidad de embarazo y picos de energía proyectados.',
                icon: Sparkles,
                color: 'bg-brand-primary/10 text-brand-primary',
              },
              {
                title: 'Diario de Síntomas',
                desc: 'Registra diariamente flujo, dolor, calidad de sueño, estado de piel y notas libres.',
                icon: Heart,
                color: 'bg-accent-rose/10 text-[#C0527A]',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white border border-accent-pink/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
