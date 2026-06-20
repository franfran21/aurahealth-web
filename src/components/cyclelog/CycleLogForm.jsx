import React, { useState } from 'react';
import { Calendar, Heart, Shield, Activity, Smile, Brain, Eye, Moon, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';

const SYMPTOMS = [
  'Calambres', 'Dolor de cabeza', 'Hinchazón', 'Fatiga',
  'Cambios de humor', 'Antojos', 'Náuseas', 'Dolor de espalda',
  'Acné', 'Sensibilidad senos'
];
const MOODS = [
  { emoji: '😊', label: 'feliz' },
  { emoji: '😐', label: 'neutral' },
  { emoji: '😔', label: 'triste' },
  { emoji: '😠', label: 'irritable' },
  { emoji: '😴', label: 'cansada' }
];
const PAIN_LEVELS = ['1', '2', '3', '4', '5'];
const SKIN_OPTIONS = ['Normal', 'Grasa', 'Seca', 'Acneica'];
const SLEEP_OPTIONS = ['Bueno', 'Interrumpido', 'Insomnio'];
const ENERGY_OPTIONS = ['Baja', 'Media', 'Alta'];
const FLOW_OPTIONS = ['Leve', 'Moderado', 'Fuerte'];

export const CycleLogForm = ({ onSubmit, loading }) => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [mood, setMood] = useState('');
  const [painLevel, setPainLevel] = useState('');
  const [skin, setSkin] = useState('');
  const [sleep, setSleep] = useState('');
  const [energy, setEnergy] = useState('');
  const [flow, setFlow] = useState('');
  const [intercourse, setIntercourse] = useState(false);
  const [isProtected, setIsProtected] = useState(true);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!startDate) return;

    const payload = {
      startDate,
      symptoms: selectedSymptoms,
      mood: mood || undefined,
      painLevel: painLevel || undefined,
      skin: skin || undefined,
      sleep: sleep || undefined,
      energy: energy ? energy.toLowerCase() : undefined,
      flow: flow ? flow.toLowerCase() : undefined,
      intercourse,
      protected: isProtected,
      notes: notes.trim() || undefined,
    };

    const isOk = await onSubmit(payload);
    if (isOk) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      
      // Reset some fields
      setSelectedSymptoms([]);
      setMood('');
      setPainLevel('');
      setSkin('');
      setSleep('');
      setEnergy('');
      setFlow('');
      setIntercourse(false);
      setNotes('');
    }
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white border border-accent-pink/15 shadow-xl p-8 relative overflow-hidden">
      {success && (
        <div className="absolute inset-0 bg-white/95 z-30 flex flex-col items-center justify-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center text-success mb-4 scale-up">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-text-primary mb-2">
            ¡Registro Guardado!
          </h3>
          <p className="text-sm text-text-secondary max-w-sm text-center leading-relaxed px-4">
            Tu información ha sido almacenada exitosamente. Luna ya tiene más contexto para guiar tu bienestar.
          </p>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-8">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="font-serif text-2xl font-bold text-text-primary mb-1">
            Diario de Síntomas
          </h2>
          <p className="text-sm text-text-secondary">
            Cuéntanos cómo te sientes. Tus respuestas calibran los análisis de la IA.
          </p>
        </div>

        {/* Date Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary" />
              Fecha de Registro
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-background-primary/40 border border-gray-200 focus:border-brand-primary/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary/30"
              required
            />
          </div>

          {/* Menstrual Flow */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#8B2252]" />
              Flujo Menstrual
            </label>
            <div className="flex gap-2">
              {FLOW_OPTIONS.map(opt => {
                const isActive = flow === opt;
                return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setFlow(flow === opt ? '' : opt)}
                  className={'flex-1 py-3 text-xs font-bold rounded-xl border transition-all ' + (isActive ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50')}
                >
                  {opt}
                </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Energy Level */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Activity className="w-4 h-4 text-success" />
              Nivel de Energía
            </label>
            <div className="flex gap-2">
              {ENERGY_OPTIONS.map(opt => {
                const isActive = energy === opt;
                return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setEnergy(energy === opt ? '' : opt)}
                  className={'flex-1 py-3 text-xs font-bold rounded-xl border transition-all ' + (isActive ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50')}
                >
                  {opt}
                </button>
                );
              })}
            </div>
          </div>

          {/* Pain Level */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-primary" />
              Intensidad del Dolor (Cramps)
            </label>
            <div className="flex gap-1.5">
              {PAIN_LEVELS.map(num => {
                const isActive = painLevel === num;
                return (
                <button
                  type="button"
                  key={num}
                  onClick={() => setPainLevel(painLevel === num ? '' : num)}
                  className={'flex-1 py-3 text-xs font-bold rounded-xl border transition-all ' + (isActive ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50')}
                >
                  {num}
                </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mood selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Smile className="w-4 h-4 text-warning" />
            Estado de Ánimo
          </label>
          <div className="grid grid-cols-5 gap-3">
            {MOODS.map(opt => {
              const isActive = mood === opt.label;
              return (
              <button
                type="button"
                key={opt.label}
                onClick={() => setMood(mood === opt.label ? '' : opt.label)}
                className={'py-3.5 rounded-xl border flex flex-col items-center gap-1 transition-all ' + (isActive ? 'bg-accent-pink/35 border-brand-primary text-brand-primary scale-105' : 'bg-white border-gray-200 text-text-secondary hover:bg-gray-50')}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
              </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skin */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#C0527A]" />
              Estado de la Piel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SKIN_OPTIONS.map(opt => {
                const isActive = skin === opt;
                return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setSkin(skin === opt ? '' : opt)}
                  className={'py-2.5 text-xs font-semibold rounded-xl border transition-all ' + (isActive ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50')}
                >
                  {opt}
                </button>
                );
              })}
            </div>
          </div>

          {/* Sleep */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Moon className="w-4 h-4 text-accent-purple" />
              Calidad del Sueño
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SLEEP_OPTIONS.map(opt => {
                const isActive = sleep === opt;
                return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setSleep(sleep === opt ? '' : opt)}
                  className={'py-2.5 text-[11px] font-semibold rounded-xl border transition-all ' + (isActive ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50')}
                >
                  {opt}
                </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Symptoms checkboxes */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#534AB7]" />
            Síntomas Experimentados
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SYMPTOMS.map(sym => {
              const active = selectedSymptoms.includes(sym);
              return (
                <button
                  type="button"
                  key={sym}
                  onClick={() => toggleSymptom(sym)}
                  className={'py-3 text-xs font-medium rounded-xl border transition-all ' + (active ? 'bg-accent-pink text-brand-primary border-brand-primary/20 font-bold scale-[1.02]' : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50')}
                >
                  {sym}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sexual Activity */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#C0527A]" />
            Relaciones Sexuales y Protección
          </label>
          <div className="flex items-center gap-6 bg-background-primary/30 p-4 rounded-xl border border-accent-pink/10">
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={intercourse}
                onChange={(e) => setIntercourse(e.target.checked)}
                className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary h-5 w-5"
              />
              <span className="font-medium">Tuve relaciones sexuales hoy</span>
            </label>
            
            {intercourse && (
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer animate-fade-in">
                <input
                  type="checkbox"
                  checked={isProtected}
                  onChange={(e) => setIsProtected(e.target.checked)}
                  className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary h-5 w-5"
                />
                <span className="font-medium">Con protección</span>
              </label>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-primary">
            Notas y Observaciones
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full text-sm bg-background-primary/30 border border-gray-200 focus:border-brand-primary/45 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-brand-primary/30 resize-none transition-all placeholder:text-text-secondary/40"
            placeholder="Escribe otros detalles sobre tu estado físico o emocional..."
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-brand-primary hover:bg-brand-primaryLight disabled:bg-brand-primary/50 text-white font-bold rounded-full shadow-lg transition-all active:scale-98 disabled:pointer-events-none"
          >
            {loading ? 'Guardando Registro...' : 'Guardar en mi Diario'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CycleLogForm;
