import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, User } from 'lucide-react';
import { useHighlight } from '../context/HighlightContext';
import { profile, experiences, skills, aiKnowledgeBase } from '../data/resumeData';
import './AIChat.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relatedSkills?: string[];
  relatedExperiences?: string[];
}

// Simple AI response generator based on keywords
function generateAIResponse(query: string): { 
  content: string; 
  skills: string[]; 
  experiences: string[] 
} {
  const lowerQuery = query.toLowerCase();
  
  // Check for specific topics
  if (lowerQuery.includes('encryption') || lowerQuery.includes('security') || lowerQuery.includes('quantum')) {
    return {
      content: `Ryan has deep expertise in post-quantum encryption and security. At Visyfy, he built a HIPAA-compliant, quantum-resistant social networking platform using patented security architecture. This forward-thinking approach ensures the platform remains secure even as quantum computers become more powerful. His work demonstrates both technical depth and strategic thinking about long-term security challenges.`,
      skills: ['Post-quantum Encryption', 'HIPAA Compliance', 'TypeScript', 'Azure'],
      experiences: ['visyfy']
    };
  }
  
  if (lowerQuery.includes('ai') || lowerQuery.includes('machine learning') || lowerQuery.includes('agent')) {
    return {
      content: `Ryan has hands-on experience building AI-powered applications. At Visyfy, he developed an AI Paralegal agent that handles client communication, document management, scheduling, and medical coordination for personal injury law firms. This project showcases his ability to integrate AI into practical, real-world applications that deliver measurable value.`,
      skills: ['AI Integration', 'Python', 'Backend Systems'],
      experiences: ['visyfy']
    };
  }
  
  if (lowerQuery.includes('automation') || lowerQuery.includes('testing') || lowerQuery.includes('qa')) {
    return {
      content: `Test automation is one of Ryan's core strengths. At Optilogic, he achieved a remarkable 99.6% reduction in automation costs while simultaneously improving bug discovery speed by 240%. At Vivint, he architected CI/CD improvements that delivered 30% better regression test performance. His approach transforms testing from a bottleneck into a competitive advantage.`,
      skills: ['Test Automation', 'CI/CD', 'Python', 'Docker'],
      experiences: ['optilogic', 'vivint']
    };
  }
  
  if (lowerQuery.includes('cost') || lowerQuery.includes('savings') || lowerQuery.includes('optimization')) {
    return {
      content: `Ryan has a proven track record of delivering massive cost optimizations. His most impressive achievement was a 99.6% reduction in monthly automation resource spending at Optilogic—achieved by re-architecting the system to use self-hosted runners. This wasn't just cost-cutting; it was a fundamental improvement to the system's architecture.`,
      skills: ['AWS', 'GCP', 'Test Automation', 'Backend Systems'],
      experiences: ['optilogic']
    };
  }
  
  if (lowerQuery.includes('cloud') || lowerQuery.includes('aws') || lowerQuery.includes('azure') || lowerQuery.includes('gcp')) {
    return {
      content: `Ryan has extensive experience across all major cloud platforms—Azure, AWS, and GCP. He's used these platforms for everything from hosting enterprise applications to building cost-effective automation infrastructure. His cloud expertise is paired with a focus on optimization, as demonstrated by his dramatic cost reductions at Optilogic.`,
      skills: ['Azure', 'AWS', 'GCP', 'Docker'],
      experiences: ['visyfy', 'optilogic', 'prior']
    };
  }
  
  if (lowerQuery.includes('frontend') || lowerQuery.includes('react') || lowerQuery.includes('javascript') || lowerQuery.includes('typescript')) {
    return {
      content: `Ryan is highly proficient in modern frontend development, particularly with React and TypeScript. At Visyfy, he built a complete end-to-end application including sophisticated frontend interfaces for their social networking platform. His JavaScript proficiency is at 97%, and he combines this with strong TypeScript skills to build type-safe, maintainable applications.`,
      skills: ['JavaScript', 'TypeScript', 'React'],
      experiences: ['visyfy']
    };
  }
  
  if (lowerQuery.includes('backend') || lowerQuery.includes('python') || lowerQuery.includes('database')) {
    return {
      content: `Ryan's backend expertise spans multiple languages and technologies. He's highly proficient in Python (89%) and has extensive experience with Postgres databases. His backend work includes building scalable APIs, automation systems, and AI integration layers. At Visyfy, he architected the entire backend for a HIPAA-compliant platform.`,
      skills: ['Python', 'Backend Systems', 'Postgres', 'Docker'],
      experiences: ['visyfy', 'vivint', 'optilogic']
    };
  }
  
  if (lowerQuery.includes('why') && lowerQuery.includes('hire')) {
    return {
      content: aiKnowledgeBase.interviewAnswers.whyHire,
      skills: ['TypeScript', 'Python', 'Test Automation', 'AI Integration'],
      experiences: ['visyfy', 'optilogic']
    };
  }
  
  if (lowerQuery.includes('strength') || lowerQuery.includes('best at')) {
    return {
      content: aiKnowledgeBase.interviewAnswers.strengths,
      skills: ['Post-quantum Encryption', 'Test Automation', 'Backend Systems'],
      experiences: ['visyfy', 'optilogic']
    };
  }
  
  if (lowerQuery.includes('experience') || lowerQuery.includes('background') || lowerQuery.includes('career')) {
    return {
      content: `Ryan has over 8 years of professional software engineering experience. He started his career at major defense contractors (Northrop Grumman, Raytheon) and tech companies (Smarter AI, Dyno Nobel), building a strong foundation in embedded systems and full-stack development. He then specialized in test automation at Optilogic and Vivint, before taking on his current role as Principle Engineer at Visyfy, where he works on cutting-edge security and AI technologies.`,
      skills: ['JavaScript', 'Python', 'Backend Systems', 'C/C++'],
      experiences: ['visyfy', 'vivint', 'optilogic', 'prior']
    };
  }
  
  if (lowerQuery.includes('education') || lowerQuery.includes('degree') || lowerQuery.includes('school')) {
    return {
      content: `Ryan holds a Bachelor of Science in Computer Engineering from Brigham Young University (2016-2019). This engineering background gives him a strong foundation in both hardware and software systems, which is evident in his embedded systems work and his deep understanding of system architecture.`,
      skills: ['C/C++', 'Embedded Systems'],
      experiences: ['prior']
    };
  }
  
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return {
      content: `Hello! I'm here to tell you about Ryan Moe, a Principle Engineer with 8+ years of experience. I can share details about his technical skills, work experience, achievements, and what makes him a great hire. What would you like to know?`,
      skills: [],
      experiences: []
    };
  }
  
  // Default response
  return {
    content: `${profile.name} is a ${profile.title} with ${profile.yearsExperience} of experience. ${profile.summary}\n\nFeel free to ask me about his technical skills, specific work experiences, achievements, or anything else you'd like to know!`,
    skills: ['JavaScript', 'Python', 'React', 'Post-quantum Encryption'],
    experiences: ['visyfy']
  };
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
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateAIResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        relatedSkills: response.skills,
        relatedExperiences: response.experiences,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // Highlight related items in the UI
      if (response.skills.length > 0 || response.experiences.length > 0) {
        highlightFromAI(response.skills, response.experiences);
      }
    }, 800 + Math.random() * 700);
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
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, experience..."
                className="chat-input"
              />
              <button type="submit" className="chat-send" disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
