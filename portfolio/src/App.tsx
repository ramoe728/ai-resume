import React from 'react';
import { HighlightProvider } from './context/HighlightContext';
import { Hero } from './components/Hero';
import { SkillBubbles } from './components/SkillBubbles';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { AIChat } from './components/AIChat';
import './App.css';

function App() {
  return (
    <HighlightProvider>
      <div className="app">
        <main className="main-content">
          <Hero />
          
          <div className="content-wrapper">
            <SkillBubbles />
            <ExperienceTimeline />
            
            {/* Footer */}
            <footer className="footer">
              <p>© 2025 Ryan Moe. Built with React & TypeScript.</p>
              <p className="footer-hint">
                💡 Try asking the AI about my skills or click on skill bubbles to explore!
              </p>
            </footer>
          </div>
        </main>
        
        <AIChat />
      </div>
    </HighlightProvider>
  );
}

export default App;
