import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, User } from 'lucide-react';
import { useHighlight } from '../context/HighlightContext';
import './AIChat.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedSkills?: string[];
  relatedExperiences?: string[];
}

interface ChatApiResponse {
  content: string;
  skills: string[];
  experiences: string[];
}

async function callChatApi(messages: { role: string; content: string }[]): Promise<ChatApiResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

  return response.json();
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm Ryan's AI assistant. I can tell you about his skills, experience, and achievements. What would you like to know?`,
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { highlightFromAI } = useHighlight();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      // Build conversation history for the API
      const conversationHistory = [...messages, userMessage]
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await callChatApi(conversationHistory);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        relatedSkills: response.skills,
        relatedExperiences: response.experiences,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Highlight related items in the UI
      if (response.skills.length > 0 || response.experiences.length > 0) {
        highlightFromAI(response.skills, response.experiences);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to get a response. Please try again.');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="chat-toggle-content"
            >
              <MessageCircle size={24} />
              <Sparkles size={14} className="sparkle" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <Sparkles size={18} />
                <span>Ask about Ryan</span>
              </div>
              <button className="chat-close" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-avatar">
                    {message.role === 'assistant' ? (
                      <Sparkles size={16} />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <div className="message-content">
                    {message.content}
                    {message.relatedSkills && message.relatedSkills.length > 0 && (
                      <div className="message-tags">
                        {message.relatedSkills.slice(0, 3).map(skill => (
                          <span key={skill} className="tag">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  className="message assistant"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-avatar">
                    <Sparkles size={16} />
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}
              {error && (
                <div className="chat-error">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, experience..."
                className="chat-input"
                disabled={isTyping}
              />
              <button type="submit" className="chat-send" disabled={!input.trim() || isTyping}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
