import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/client';
import { Sparkles, Calendar, Heart, Shield, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const CYCLE_LENGTHS = [21, 24, 26, 28, 30, 32, 35];
const PERIOD_DURATIONS = [3, 4, 5, 6, 7];
const SYMPTOMS_LIST = ['Hinchazón', 'Calambres', 'Dolor de cabeza', 'Acné', 'Fatiga', 'Insomnio', 'Ansiedad', 'Seno sensible', 'Náuseas', 'Cambios de humor'];
const GOALS_LIST = ['Equilibrio Hormonal', 'Energía', 'Estado de ánimo', 'Fertilidad', 'Piel y Cabello'];
const BIRTH_CONTROL_OPTIONS = ['Ninguno', 'Pastillas', 'DIU', 'Implante', 'Inyección', 'Parche', 'Condones', 'Otro'];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { userName, setUser } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState(userName || '');
  const [lastPeriod, setLastPeriod] = useState(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState(28);
  const [showCustomCycle, setShowCustomCycle] = useState(false);
  const [customCycleValue, setCustomCycleValue] = useState('');
  
  const [periodDuration, setPeriodDuration] = useState(5);
  const [symptoms, setSymptoms] = useState([]);
  const [goals, setGoals] = useState([]);
  const [birthControl, setBirthControl] = useState('Ninguno');
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (step === 1 && !name.trim()) {
      alert('Ingresa tu nombre para continuar.');
      return;
    }
    
    if (step < 5) {
      setStep(step + 1);
    } else {
      setSaving(true);
      const finalName = name.trim();
      const finalCycleLength = showCustomCycle ? (parseInt(customCycleValue, 10) || 28) : cycleLength;
      
      try {
        await api.post('/user/onboarding', {
          name: finalName,
          lastPeriod: lastPeriod,
          cycleLength: finalCycleLength,
          periodDuration: periodDuration,
          symptoms,
          goals,
          birthControl,
        });

        // Actualizar datos de usuario locales
        const localUser = JSON.parse(localStorage.getItem('aurahealth_user')) || {};
        const updatedUser = { ...localUser, name: finalName };
        setUser(updatedUser);

        navigate('/home');
      } catch (err) {
        console.error('Error in onboarding:', err);
        // Continuar de todos modos, como en la app móvil
        navigate('/home');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleSelection = (item, list, setter) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">
                ¿Cómo te llamas?
              </h2>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                Queremos personalizar tu experiencia en AuraHealth+ y que Luna se dirija a ti de forma cálida.
              </p>
            </div>
            
            <div className="max-w-sm mx-auto">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-background-primary/30 border border-gray-200 focus:border-brand-primary/45 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary/30 transition-all text-center text-lg font-medium"
                autoFocus
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">
                ¿Cada cuántos días tienes tu ciclo?
              </h2>
              <p className="text-sm text-text-secondary max-w-md mx-auto">
                El promedio general es de 28 días, pero varía en cada mujer. Selecciona tu duración o escribe una personalizada.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {CYCLE_LENGTHS.map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => {
                      setCycleLength(len);
                      setShowCustomCycle(false);
                    }}
                    className={`py-3 text-sm font-semibold rounded-full border transition-all ${
                      cycleLength === len && !showCustomCycle
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {len} días
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCustomCycle(true)}
                  className={`py-3 text-sm font-semibold rounded-full border transition-all ${
                    showCustomCycle
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Otro
                </button>
              </div>

              {showCustomCycle && (
                <div className="mt-4 max-w-xs mx-auto animate-fade-in">
                  <input
                    type="number"
                    value={customCycleValue}
                    onChange={(e) => setCustomCycleValue(e.target.value)}
                    placeholder="Cantidad de días (ej. 29)"
                    className="w-full bg-background-primary/30 border border-gray-200 focus:border-brand-primary/45 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary/30 text-center"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">
                ¿Cuántos días dura tu sangrado?
              </h2>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                Selecciona la cantidad de días promedio que suele durar tu periodo menstrual.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-3 gap-3">
                {PERIOD_DURATIONS.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setPeriodDuration(dur)}
                    className={`py-3.5 text-sm font-semibold rounded-full border transition-all ${
                      periodDuration === dur
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {dur} días
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPeriodDuration(8)}
                  className={`py-3.5 text-sm font-semibold rounded-full border transition-all ${
                    periodDuration === 8
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  8+ días
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-2 max-w-sm mx-auto">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider text-center">
                  ¿Cuándo comenzó tu último periodo?
                </label>
                <input
                  type="date"
                  value={lastPeriod}
                  onChange={(e) => setLastPeriod(e.target.value)}
                  className="bg-background-primary/40 border border-gray-200 focus:border-brand-primary/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary/30 text-center"
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">
                ¿Qué síntomas sueles experimentar?
              </h2>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                Selecciona todos los que se manifiestan frecuentemente a lo largo de tus fases.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="flex flex-wrap gap-2.5 justify-center">
                {SYMPTOMS_LIST.map((sym) => {
                  const selected = symptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSelection(sym, symptoms, setSymptoms)}
                      className={`px-5 py-2.5 text-sm font-medium rounded-full border transition-all ${
                        selected
                          ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                          : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="font-serif text-2xl font-bold text-text-primary mb-2">
                  ¿Cuáles son tus objetivos?
                </h3>
                <p className="text-xs text-text-secondary">
                  Selecciona lo que más te gustaría calibrar con AuraHealth+.
                </p>
              </div>

              <div className="max-w-2xl mx-auto flex flex-wrap gap-2.5 justify-center">
                {GOALS_LIST.map((goal) => {
                  const selected = goals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleSelection(goal, goals, setGoals)}
                      className={`px-5 py-2 text-xs font-semibold rounded-full border transition-all ${
                        selected
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-serif text-2xl font-bold text-text-primary mb-2">
                  ¿Usas algún método anticonceptivo?
                </h3>
              </div>

              <div className="max-w-2xl mx-auto flex flex-wrap gap-2 justify-center">
                {BIRTH_CONTROL_OPTIONS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setBirthControl(method)}
                    className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                      birthControl === method
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white text-text-secondary border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background-primary/30">
      <div className="max-w-xl mx-auto w-full">
        {/* Progress Tracker */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-brand-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <Card className="bg-white border border-accent-pink/15 shadow-xl p-8 rounded-3xl min-h-[380px] flex flex-col justify-between">
          {/* Form step render */}
          <div className="flex-1 flex flex-col justify-center py-4">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack} className="px-6 py-2.5">
                Atrás
              </Button>
            ) : (
              <div />
            )}
            
            <Button
              variant="primary"
              onClick={handleNext}
              loading={saving}
              disabled={step === 1 && !name.trim()}
              className="px-8 py-2.5 font-bold ml-auto"
            >
              {step === 5 ? 'Comenzar' : 'Siguiente'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
