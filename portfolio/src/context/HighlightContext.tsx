import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface HighlightState {
  highlightedSkills: string[];
  highlightedExperiences: string[];
  activeSkills: string[];
  activeExperience: string | null;
}

interface HighlightContextType extends HighlightState {
  setHighlightedSkills: (skills: string[]) => void;
  setHighlightedExperiences: (experiences: string[]) => void;
  toggleActiveSkill: (skill: string) => void;
  setActiveSkills: (skills: string[]) => void;
  setActiveExperience: (experience: string | null) => void;
  highlightFromAI: (skills: string[], experiences: string[]) => void;
  clearHighlights: () => void;
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export function HighlightProvider({ children }: { children: ReactNode }) {
  const [highlightedSkills, setHighlightedSkills] = useState<string[]>([]);
  const [highlightedExperiences, setHighlightedExperiences] = useState<string[]>([]);
  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeExperience, setActiveExperience] = useState<string | null>(null);

  // Toggle a skill in/out of the active skills array
  const toggleActiveSkill = useCallback((skill: string) => {
    setActiveSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  }, []);

  // Called by AI to highlight relevant items
  const highlightFromAI = useCallback((skills: string[], experiences: string[]) => {
    setHighlightedSkills(skills);
    setHighlightedExperiences(experiences);
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlightedSkills([]);
    setHighlightedExperiences([]);
    setActiveSkills([]);
    setActiveExperience(null);
  }, []);

  return (
    <HighlightContext.Provider
      value={{
        highlightedSkills,
        highlightedExperiences,
        activeSkills,
        activeExperience,
        setHighlightedSkills,
        setHighlightedExperiences,
        toggleActiveSkill,
        setActiveSkills,
        setActiveExperience,
        highlightFromAI,
        clearHighlights,
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
}

export function useHighlight() {
  const context = useContext(HighlightContext);
  if (context === undefined) {
    throw new Error('useHighlight must be used within a HighlightProvider');
  }
  return context;
}
