import { HighlightProvider } from './context/HighlightContext';
import { Hero } from './components/Hero';
import { SkillBubbles } from './components/SkillBubbles';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { Recommendations } from './components/Recommendations';
import { SkillConnectorLines } from './components/SkillConnectorLines';
import { AIChat } from './components/AIChat';
import './App.css';

function App() {
  return (
    <HighlightProvider>
      <div className="app" style={{ position: 'relative' }}>
        <SkillConnectorLines />
        <main className="main-content">
          <Hero />
          
          <div className="content-wrapper">
            <SkillBubbles />
            <ExperienceTimeline />
            <Recommendations />
            
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
