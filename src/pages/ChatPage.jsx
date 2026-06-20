import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import ChatWindow from '../components/chat/ChatWindow';

const getWelcomeMessage = () => ({
  id: 'welcome-0',
  text: 'Hola, soy Luna 🌙 Tu asistente de salud femenina. Estoy aquí para acompañarte en tu ciclo, responder tus dudas y ayudarte a entender mejor tu cuerpo. ¿Cómo te sientes hoy?',
  sender: 'luna',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

export const ChatPage = () => {
  const { user } = useAuthStore();
  const userId = user?.id || 'guest';
  const localStorageKey = `aurahealth_chat_history_${userId}`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(localStorageKey);
    return saved ? JSON.parse(saved) : [getWelcomeMessage()];
  });
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  // Persist messages to local storage
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(messages));
  }, [messages, localStorageKey]);

  // Handle stream typing simulation
  const simulateStreaming = (fullText, callback) => {
    const words = fullText.split(' ');
    let wordIndex = 0;
    let accumulatedText = '';
    
    setStreamingText('');
    
    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        accumulatedText += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
        setStreamingText(accumulatedText);
        wordIndex++;
      } else {
        clearInterval(interval);
        setStreamingText('');
        callback(fullText);
      }
    }, 45); // ~45ms per word for fluid streaming feel
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || loading || !!streamingText) return;

    // 1. Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // 2. Fetch from backend
      const res = await api.post('/chat/message', { message: text.trim() });
      const botResponse = res.data?.response || 'Luna está en silencio en este momento. ¿Podrías volver a preguntar? 🌙';

      setLoading(false);

      // 3. Simulate streaming response
      simulateStreaming(botResponse, (finalText) => {
        const botMsg = {
          id: `luna-${Date.now()}`,
          text: finalText,
          sender: 'luna',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      });

    } catch (err) {
      setLoading(false);
      
      // Friendly errors, never technical jargon
      const errorMsg = 'Luna está teniendo un momento de descanso, pero volverá enseguida. ¿Puedes intentarlo de nuevo en un momento? 🌙';
      
      simulateStreaming(errorMsg, (finalText) => {
        const botMsg = {
          id: `luna-err-${Date.now()}`,
          text: finalText,
          sender: 'luna',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      });
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('¿Estás segura de que deseas borrar el historial de conversación?')) {
      try {
        await api.delete('/chat/history');
      } catch (err) {
        console.error('Error clearing remote history:', err);
      }
      
      // Clear local history
      setMessages([getWelcomeMessage()]);
      setStreamingText('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-text-primary">
          Conversa con Luna
        </h1>
        <p className="text-sm text-text-secondary mt-1 max-w-lg mx-auto">
          Luna te acompaña de manera empática y personalizada según tu fase hormonal.
        </p>
      </div>

      <ChatWindow
        messages={messages}
        loading={loading}
        onSend={handleSendMessage}
        onClear={handleClearHistory}
        streamingMessageText={streamingText}
      />
    </div>
  );
};

export default ChatPage;
