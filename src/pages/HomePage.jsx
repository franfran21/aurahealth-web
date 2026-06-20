import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import DailyInsightCard from '../components/insights/DailyInsightCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Heart, 
  TrendingUp, 
  ChevronRight, 
  Activity, 
  Award,
  Sparkles
} from 'lucide-react';

const PHASE_BG_COLORS = {
  menstruacion: 'bg-[#8B2252] text-white',
  ovulacion: 'bg-[#C0527A] text-white',
  fertil: 'bg-[#F2C4D0] text-brand-primary',
  lutea: 'bg-[#534AB7] text-white',
  folicular: 'bg-[#FDFAF9] text-text-primary border border-accent-pink/15',
  normal: 'bg-white text-text-primary border border-gray-100',
};

const PHASE_LABELS = {
  menstruacion: 'Menstruación',
  folicular: 'Fase Folicular',
  ovulacion: 'Ovulación',
  fertil: 'Ventana Fértil',
  lutea: 'Fase Lútea',
};

export const HomePage = () => {
  const navigate = useNavigate();
  const { userName } = useAuthStore();
  const [cycle, setCycle] = useState(null);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingInsight, setGeneratingInsight] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Obtener ciclo actual
      const cycleRes = await api.get('/cycle/current');
      setCycle(cycleRes.data);

      // 2. Obtener insight diario
      const todayStr = new Date().toISOString().split('T')[0];
      const insightRes = await api.get('/insights/daily', { params: { date: todayStr } });
      
      const data = insightRes.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setInsight(data);
      } else if (Array.isArray(data) && data.length > 0) {
        setInsight(data[0]);
      } else {
        setInsight(null);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerateInsight = async () => {
    setGeneratingInsight(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await api.post('/insights/daily/generate', null, { params: { date: todayStr } });
      
      // Reload insight
      const insightRes = await api.get('/insights/daily', { params: { date: todayStr } });
      const data = insightRes.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setInsight(data);
      } else if (Array.isArray(data) && data.length > 0) {
        setInsight(data[0]);
      }
    } catch (err) {
      alert('Luna está procesando otros datos, por favor intenta en unos momentos.');
    } finally {
      setGeneratingInsight(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Calculate percentage of cycle completed
  const progressPercent = cycle 
    ? Math.min(Math.round((cycle.currentDay / cycle.avgCycleLength) * 100), 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/60">Dashboard</span>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-text-primary mt-1">
            Hola, {userName}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Tu bienestar está sincronizado. Esto es lo que Luna analizó hoy.
          </p>
        </div>
        
        {!cycle && (
          <Link
            to="/onboarding"
            className="px-6 py-3 bg-brand-primary hover:bg-brand-primaryLight text-white rounded-full font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            Configurar mi Ciclo
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Cycle Phase & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cycle Progress Card */}
          {cycle ? (
            <Card className="bg-white border border-accent-pink/15 shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-text-primary">
                    Estado del Ciclo
                  </h3>
                  <p className="text-xs text-text-secondary/60 mt-0.5">
                    Fase estimada en base a tus registros anteriores.
                  </p>
                </div>
                
                <Badge variant={cycle.phase?.toLowerCase() === 'menstruacion' ? 'brand' : 'accent'}>
                  {PHASE_LABELS[cycle.phase?.toLowerCase()] || cycle.phase}
                </Badge>
              </div>

              {/* Progress Circle or Bar */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-text-primary">Día {cycle.currentDay} de {cycle.avgCycleLength}</span>
                  <span className="text-brand-primary">{progressPercent}% completado</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden border border-gray-100 flex">
                  <div 
                    style={{ width: `${progressPercent}%` }} 
                    className="bg-brand-primary rounded-full h-full transition-all duration-500 shadow-inner" 
                  />
                </div>
                
                <div className="flex justify-between text-xs text-text-secondary/50 pt-1">
                  <span>Último periodo: {cycle.lastPeriodDate}</span>
                  <span>Próximo periodo: {cycle.nextPeriodDate}</span>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-gradient-to-tr from-accent-pink/20 to-white border border-accent-pink/15 shadow-sm p-8 text-center flex flex-col items-center justify-center py-12">
              <span className="text-4xl mb-4">🌙</span>
              <h3 className="font-serif text-lg font-bold text-text-primary mb-2">
                Aún no has registrado tu ciclo
              </h3>
              <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-6">
                Completa tu onboarding inicial para que Luna pueda estimar tus fases, predecir tu fertilidad y ofrecerte consejos de salud personalizados.
              </p>
              <Link
                to="/onboarding"
                className="px-6 py-3 bg-brand-primary hover:bg-brand-primaryLight text-white rounded-full font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Comenzar Onboarding
              </Link>
            </Card>
          )}

          {/* Quick Actions Grid */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-text-primary">
              Accesos Rápidos
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link 
                to="/chat" 
                className="flex items-center gap-4 bg-white border border-accent-pink/10 hover:border-brand-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-accent-pink/30 rounded-xl flex items-center justify-center text-brand-primary flex-shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-text-primary">Chat con Luna</h4>
                  <p className="text-[11px] text-text-secondary/70 mt-0.5">Asesoría de salud con IA</p>
                </div>
              </Link>

              <Link 
                to="/registro-ciclo" 
                className="flex items-center gap-4 bg-white border border-accent-pink/10 hover:border-brand-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-accent-rose/10 rounded-xl flex items-center justify-center text-[#C0527A] flex-shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-text-primary">Registrar Hoy</h4>
                  <p className="text-[11px] text-text-secondary/70 mt-0.5">Diario de síntomas</p>
                </div>
              </Link>

              <Link 
                to="/calendario" 
                className="flex items-center gap-4 bg-white border border-accent-pink/10 hover:border-brand-primary/20 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-accent-purple/10 rounded-xl flex items-center justify-center text-accent-purple flex-shrink-0">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-serif text-sm font-bold text-text-primary">Calendario</h4>
                  <p className="text-[11px] text-text-secondary/70 mt-0.5">Fases mensuales</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Daily Insight Card & Extra info */}
        <div className="space-y-6">
          <DailyInsightCard 
            insight={insight} 
            onGenerate={handleGenerateInsight} 
            generating={generatingInsight} 
            phaseName={cycle?.phase || 'Fase Desconocida'} 
          />

          {/* Quick Health Status Card */}
          <Card className="bg-white border border-accent-pink/15 shadow-sm p-6">
            <h4 className="font-serif text-base font-bold text-text-primary mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-primary" />
              Estado Hormonal
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-text-secondary">Balance general</span>
                <span className="font-bold text-success">Estable</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-text-secondary">Nivel de energía</span>
                <span className="font-bold text-brand-primary">Favorable</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-text-secondary">Sincronización</span>
                <span className="font-bold text-accent-purple flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Alta
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
