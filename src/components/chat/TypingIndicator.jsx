import React from 'react';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 mb-6 items-center justify-start animate-fade-in">
      {/* Avatar for Luna */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-pink flex items-center justify-center text-brand-primary font-bold shadow-sm border border-brand-primary/10">
        <span className="text-lg">🌙</span>
      </div>

      {/* Typing Bubble */}
      <div className="bg-accent-pink/60 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm border border-brand-primary/5">
        <span className="text-sm font-medium text-brand-primary italic mr-1">
          Luna está escribiendo
        </span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
