import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import FertilityChart from '../components/predictions/FertilityChart';
import PredictionCard from '../components/predictions/PredictionCard';
import Spinner from '../components/ui/Spinner';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Sparkles, Calendar, Info, Heart, Zap, RefreshCw } from 'lucide-react';

export const PredictionsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/metrics/predictions');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const pregnancyProb = data?.pregnancyProbability || 'Desconocida';
  const energyLevel = data?.energyLevel || 50;

  let energyLabel = 'Moderada';
  let energyColor = 'text-warning';
  if (energyLevel > 70) {
    energyLabel = 'Alta';
    energyColor = 'text-success';
  } else if (energyLevel < 40) {
    energyLabel = 'Baja';
    energyColor = 'text-red-500';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary/60">Proyecciones</span>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-text-primary mt-1">
            Predicción Luna
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {data?.phase ? `Fase ${data.phase} — Día ${data.currentDay} de tu ciclo` : 'Tu equilibrio hormonal proyectado.'}
          </p>
        </div>

        <button
          onClick={fetchPredictions}
          className="p-2 hover:bg-background-primary rounded-full text-brand-primary transition-colors border border-accent-pink/15 flex items-center gap-1.5 text-xs font-bold"
          title="Recargar predicciones"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Warning Callout for insufficient data */}
      {!data?.hasEnoughData && (
        <div className="mb-8 rounded-2xl bg-amber-50 p-5 border border-amber-200 flex items-start gap-4 max-w-4xl mx-auto text-amber-900 shadow-sm animate-pulse-soft">
          <Info className="w-6 h-6 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm mb-1">Predicción estimada</h4>
            <p className="text-xs leading-relaxed text-amber-800">
              Registra <strong>{Math.max(2 - (data?.cyclesRegistered || 0), 1)} ciclo(s) más</strong> en tu Diario para calibrar los algoritmos de Luna a tu ritmo hormonal único. Por ahora, te mostramos estimaciones estándar basadas en tu perfil básico.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns - Gauges & Graphs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Energy Gauge & Projections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border border-accent-pink/15 shadow-sm p-6 flex flex-col justify-between items-center text-center">
              <h3 className="font-serif text-base font-bold text-text-primary mb-4 w-full text-left">
                Energía Estimada Hoy
              </h3>
              
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Radial progress ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-gray-100"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-brand-primary"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - energyLevel / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-primary mb-0.5 animate-pulse" />
                  <span className="text-3xl font-extrabold text-text-primary leading-tight">{energyLevel}%</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${energyColor}`}>{energyLabel}</span>
                </div>
              </div>

              <p className="text-xs text-text-secondary/60 mt-6 leading-relaxed max-w-xs">
                Tu nivel de energía fluctúa según la concentración de estrógenos y progesterona de tu fase actual.
              </p>
            </Card>

            {/* Cycle Projections list */}
            <Card className="bg-white border border-accent-pink/15 shadow-sm p-6">
              <h3 className="font-serif text-base font-bold text-text-primary mb-6">
                Proyecciones del Ciclo
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-semibold text-text-secondary">Próximo período</span>
                  <span className="text-sm font-bold text-text-primary">{data?.nextPeriodDate || 'Pendiente'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-semibold text-text-secondary">Ventana de ovulación</span>
                  <span className="text-sm font-bold text-[#C0527A]">{data?.ovulationWindow || 'Pendiente'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs font-semibold text-text-secondary">Días de mayor energía</span>
                  <span className="text-sm font-bold text-success">{data?.highEnergyDays || 'Pendiente'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-semibold text-text-secondary">Probabilidad de embarazo</span>
                  <Badge 
                    variant={
                      pregnancyProb === 'Alta' 
                        ? 'brand' 
                        : pregnancyProb === 'Media' 
                          ? 'ovulacion' 
                          : 'gray'
                    }
                  >
                    {pregnancyProb}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Fertility Curve Chart */}
          <Card className="bg-white border border-accent-pink/15 shadow-sm p-6">
            <div className="mb-4">
              <h3 className="font-serif text-lg font-bold text-text-primary">
                Curva de Probabilidad de Embarazo
              </h3>
              <p className="text-xs text-text-secondary/60 mt-0.5">
                Estimación de fertilidad a lo largo de un ciclo típico de {data?.avgCycleLength || 28} días.
              </p>
            </div>
            
            <FertilityChart currentDay={data?.currentDay || 1} />
          </Card>
        </div>

        {/* Right Column - Factors & Recommendations */}
        <div className="space-y-6">
          {/* Biological factors list */}
          <Card className="bg-white border border-accent-pink/15 shadow-sm p-6">
            <h3 className="font-serif text-base font-bold text-text-primary mb-5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-primary" />
              Factores Biológicos
            </h3>
            
            <div className="space-y-4">
              {data?.factors && data.factors.length > 0 ? (
                data.factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2.5">
                      <span 
                        style={{ backgroundColor: factor.color }} 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      />
                      <span className="text-xs font-semibold text-text-secondary capitalize">{factor.label}</span>
                    </div>
                    <span 
                      style={{ color: factor.color }} 
                      className="text-xs font-bold"
                    >
                      {factor.value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-secondary/50 text-center py-4">No hay suficientes factores registrados.</p>
              )}
            </div>
          </Card>

          {/* Luna Advice Card */}
          <PredictionCard
            title="Luna dice..."
            recommendation={data?.recommendation || 'Sigue registrando tu ciclo para obtener predicciones precisas.'}
            badge="IA Predictiva"
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionsPage;
