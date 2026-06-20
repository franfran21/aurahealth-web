import React, { useState, useEffect } from 'react';
import { Heart, Activity, Smile, Brain, Calendar, Info, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { PHASE_LABELS } from './CycleCalendar';

const FLOW_OPTIONS = ['leve', 'moderado', 'fuerte'];
const ENERGY_OPTIONS = ['baja', 'media', 'alta'];
const MOOD_OPTIONS = ['feliz', 'tranquila', 'triste', 'irritable', 'ansiosa', 'cansada', 'energetica', 'neutral'];
const SYMPTOM_OPTIONS = ['hinchazón', 'dolor de cabeza', 'acné', 'calambres', 'insomnio', 'ansiedad', 'seno sensible', 'fatiga', 'náuseas'];

export const DayDetail = ({
  day,
  month,
  year,
  dayData,
  onSave,
  saving,
}) => {
  const [flow, setFlow] = useState('');
  const [energy, setEnergy] = useState('');
  const [mood, setMood] = useState('');
  const [intercourse, setIntercourse] = useState(false);
  const [isProtected, setIsProtected] = useState(true);
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync form state with dayData when selected day changes
  useEffect(() => {
    if (dayData) {
      setFlow(dayData.flow || '');
      setEnergy(dayData.energy || '');
      setMood(dayData.mood || '');
      setIntercourse(!!dayData.intercourse);
      setIsProtected(dayData.protected !== false); // default to true if null/undefined
      setSymptoms(dayData.symptoms || []);
      setNotes(dayData.notes || '');
    } else {
      setFlow('');
      setEnergy('');
      setMood('');
      setIntercourse(false);
      setIsProtected(true);
      setSymptoms([]);
      setNotes('');
    }
    setShowSuccess(false);
  }, [dayData, day]);

  const toggleSymptom = (symptom) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const success = await onSave({
      flow,
      energy,
      mood,
      intercourse,
      protected: isProtected,
      symptoms,
      notes,
    });
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const formattedDate = `${day} de ${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(year, month, 1))} ${year}`;

  return (
    <div className="bg-white border border-accent-pink/10 rounded-2xl p-6 shadow-md h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <Calendar className="w-5 h-5 text-brand-primary" />
          <h4 className="font-serif text-lg font-bold text-text-primary">
            {formattedDate}
          </h4>
        </div>

        {/* Phase Info */}
        {dayData?.phase && (
          <div className="flex items-center gap-2 mb-6 bg-accent-pink/15 px-4 py-2.5 rounded-xl border border-accent-pink/10">
            <Info className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-semibold text-brand-primary">
              Estimación: {PHASE_LABELS[dayData.phase] || dayData.phase}
            </span>
          </div>
        )}

        {/* Form Editor */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Menstrual Flow */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 text-[#8B2252]" />
              Flujo Menstrual
            </label>
            <div className="flex gap-2">
              {FLOW_OPTIONS.map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setFlow(flow === opt ? '' : opt)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-full border transition-all uppercase ${
                    flow === opt
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-success" />
              Nivel de Energía
            </label>
            <div className="flex gap-2">
              {ENERGY_OPTIONS.map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setEnergy(energy === opt ? '' : opt)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-full border transition-all uppercase ${
                    energy === opt
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              <Smile className="w-3.5 h-3.5 text-warning" />
              Estado de Ánimo
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {MOOD_OPTIONS.map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setMood(mood === opt ? '' : opt)}
                  className={`py-2 text-[11px] font-semibold rounded-xl border transition-all capitalize ${
                    mood === opt
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Grid */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              <Brain className="w-3.5 h-3.5 text-[#534AB7]" />
              Síntomas
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SYMPTOM_OPTIONS.map(sym => {
                const active = symptoms.includes(sym);
                return (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      active
                        ? 'bg-accent-pink text-brand-primary border-brand-primary/25 font-semibold'
                        : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intercourse */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C0527A]" />
              Actividad Sexual
            </label>
            <div className="flex items-center gap-4 bg-background-primary/30 p-3 rounded-xl border border-accent-pink/10">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={intercourse}
                  onChange={(e) => setIntercourse(e.target.checked)}
                  className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary h-4.5 w-4.5"
                />
                <span>Relaciones sexuales</span>
              </label>
              
              {intercourse && (
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer animate-fade-in">
                  <input
                    type="checkbox"
                    checked={isProtected}
                    onChange={(e) => setIsProtected(e.target.checked)}
                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary h-4.5 w-4.5"
                  />
                  <span>Protección</span>
                </label>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-text-secondary" />
              Notas Libres
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anota cualquier observación que Luna deba analizar..."
              rows={3}
              className="w-full text-sm bg-background-primary/30 border border-gray-200 focus:border-brand-primary/45 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 resize-none transition-all placeholder:text-text-secondary/40"
            />
          </div>

          {/* Success / Save Action */}
          <div className="pt-2 flex items-center justify-between gap-4">
            {showSuccess ? (
              <div className="flex items-center gap-1.5 text-success font-semibold text-sm animate-pulse">
                <CheckCircle2 className="w-5 h-5" />
                <span>¡Guardado correctamente!</span>
              </div>
            ) : (
              <div />
            )}
            
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-full bg-brand-primary hover:bg-brand-primaryLight disabled:bg-brand-primary/50 text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:pointer-events-none"
            >
              {saving ? 'Guardando...' : 'Guardar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DayDetail;
