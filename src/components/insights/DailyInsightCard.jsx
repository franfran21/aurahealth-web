import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, Calendar, RotateCw, Heart } from 'lucide-react';

export const DailyInsightCard = ({
  insight,
  onGenerate,
  generating,
  phaseName = 'Fase Folicular',
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(date);
    } catch {
      return '';
    }
  };

  return (
    <Card className="bg-[#8B2252] text-white p-6 shadow-xl relative overflow-hidden border border-brand-primaryDark select-none">
      {/* Decorative gradient glowing circles */}
      <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-accent-pink/20 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 rounded-full bg-accent-purple/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Info row */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-pink/80 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Insight del Día
            </span>
            <span className="text-xs text-white/60 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3 h-3" />
              {formatDate(insight?.date || insight?.createdAt)}
            </span>
          </div>
          
          <Badge variant="accent" className="bg-white/10 text-white border-white/20 uppercase text-[9px] font-extrabold px-2.5 py-0.5">
            {phaseName}
          </Badge>
        </div>

        {/* Main AI Text */}
        <div className="mb-6">
          <h3 className="font-serif text-xl font-bold mb-2">
            {insight?.title || 'Análisis Hormonal Luna'}
          </h3>
          <p className="text-sm font-medium text-white/90 leading-relaxed max-w-xl">
            {insight?.aiDiagnosis || insight?.description || 'Tu nivel de estrógenos está subiendo. Es un momento ideal para actividades creativas y ejercicio ligero.'}
          </p>
        </div>

        {/* Action Row */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-white/60">
            <Heart className="w-3.5 h-3.5 text-accent-pink fill-accent-pink animate-pulse" />
            <span>Luna AI Ecosystem</span>
          </div>

          <button
            onClick={onGenerate}
            disabled={generating}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-xs font-bold text-white transition-all active:scale-95 disabled:pointer-events-none"
          >
            <RotateCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Analizando...' : 'Generar de nuevo'}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default DailyInsightCard;
