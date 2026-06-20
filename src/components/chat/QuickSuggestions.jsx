import React from 'react';
import { Sparkles } from 'lucide-react';

export const QuickSuggestions = ({ onSelect }) => {
  const suggestions = [
    "¿Cómo está mi ciclo hoy?",
    "Tengo dolor menstrual",
    "¿Qué debo comer esta semana?",
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto mt-8 animate-fade-in">
      <div className="w-12 h-12 bg-accent-pink/30 rounded-full flex items-center justify-center text-brand-primary mb-4">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>
      <h3 className="font-serif text-lg font-bold text-text-primary mb-2">
        Pregúntale a Luna
      </h3>
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        Elige un tema o escribe tu consulta en el recuadro inferior para recibir asesoría personalizada.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="px-5 py-3 text-sm font-medium text-brand-primary bg-accent-pink hover:bg-brand-primary hover:text-white rounded-full border border-brand-primary/10 hover:border-transparent transition-all duration-300 shadow-sm active:scale-95 text-center"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;
