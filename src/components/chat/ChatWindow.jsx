import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickSuggestions from './QuickSuggestions';
import ChatInput from './ChatInput';
import { Trash2 } from 'lucide-react';

export const ChatWindow = ({
  messages,
  loading,
  onSend,
  onClear,
  streamingMessageText = '',
}) => {
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, streamingMessageText]);

  // Welcome message is at index 0, so if messages.length <= 1, it's empty/just welcome
  const isChatEmpty = messages.length <= 1 && !loading;

  return (
    <div className="flex flex-col bg-white border border-accent-pink/15 rounded-2xl shadow-xl h-[650px] max-w-4xl mx-auto overflow-hidden animate-fade-in">
      {/* Chat Header */}
      <div className="bg-brand-primary text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-pink/30 flex items-center justify-center border border-white/10">
            <span className="text-xl">🌙</span>
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold leading-tight">Luna</h2>
            <p className="text-xs text-accent-pink font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
              Asistente de Salud Femenina
            </p>
          </div>
        </div>
        
        {messages.length > 1 && (
          <button
            onClick={onClear}
            className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
            title="Borrar conversación"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Message Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 bg-background-primary/25 scroll-smooth"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Display Simulated Streamed Text in progress */}
        {streamingMessageText && (
          <MessageBubble
            message={{
              id: 'streaming-msg',
              text: streamingMessageText,
              sender: 'luna',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }}
          />
        )}

        {loading && <TypingIndicator />}

        {isChatEmpty && (
          <QuickSuggestions onSelect={onSend} />
        )}
      </div>

      {/* Message Input */}
      <ChatInput onSend={onSend} disabled={loading || !!streamingMessageText} />
    </div>
  );
};

export default ChatWindow;
