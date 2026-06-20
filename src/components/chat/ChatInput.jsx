import React, { useState, useRef } from 'react';
import { SendHorizontal } from 'lucide-react';

export const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter, unless Shift is held
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-accent-pink/20 bg-white p-4 flex items-end gap-3 rounded-b-2xl shadow-inner">
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        placeholder={disabled ? "Luna está respondiendo..." : "Escribe a Luna..."}
        className="flex-1 bg-background-primary text-text-primary placeholder-text-secondary/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary/40 resize-none border border-transparent focus:border-brand-primary/20 min-h-[44px] max-h-[120px] transition-all disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="flex-shrink-0 w-11 h-11 bg-brand-primary hover:bg-brand-primaryLight disabled:bg-brand-primary/40 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 disabled:pointer-events-none"
      >
        <SendHorizontal className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;
