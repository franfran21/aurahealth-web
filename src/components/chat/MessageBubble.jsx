import React from 'react';

export const MessageBubble = ({ message }) => {
  const isLuna = message.sender === 'luna';

  return (
    <div className={`flex gap-3 mb-6 items-start ${isLuna ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar for Luna */}
      {isLuna && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-pink flex items-center justify-center text-brand-primary font-bold shadow-sm shadow-brand-primary/10 border border-brand-primary/10">
          <span className="text-lg">🌙</span>
        </div>
      )}

      {/* Message Box */}
      <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isLuna ? 'items-start' : 'items-end'}`}>
        <div
          className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
            isLuna
              ? 'bg-accent-pink text-text-primary rounded-tl-sm'
              : 'bg-brand-primary text-white rounded-tr-sm'
          }`}
        >
          {/* Preserving double newlines formatting */}
          {message.text.split('\n').map((paragraph, idx) => (
            <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] text-text-secondary/50 mt-1.5 px-2">
          {message.timestamp}
        </span>
      </div>

      {/* Avatar for User */}
      {!isLuna && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold border border-brand-primary/20">
          <span className="text-sm font-semibold">U</span>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
