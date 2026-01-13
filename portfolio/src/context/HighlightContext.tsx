import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface HighlightState {
  highlightedSkills: string[];
  highlightedExperiences: string[];
  activeSkill: string | null;
  activeExperience: string | null;
}

interface HighlightContextType extends HighlightState {
  setHighlightedSkills: (skills: string[]) => void;
  setHighlightedExperiences: (experiences: string[]) => void;
  setActiveSkill: (skill: string | null) => void;
  setActiveExperience: (experience: string | null) => void;
  highlightFromAI: (skills: string[], experiences: string[]) => void;
  clearHighlights: () => void;
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export function HighlightProvider({ children }: { children: ReactNode }) {
  const [highlightedSkills, setHighlightedSkills] = useState<string[]>([]);
  const [highlightedExperiences, setHighlightedExperiences] = useState<string[]>([]);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [activeExperience, setActiveExperience] = useState<string | null>(null);

  // Called by AI to highlight relevant items
  const highlightFromAI = useCallback((skills: string[], experiences: string[]) => {
    setHighlightedSkills(skills);
    setHighlightedExperiences(experiences);
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlightedSkills([]);
    setHighlightedExperiences([]);
    setActiveSkill(null);
    setActiveExperience(null);
  }, []);

  return (
    <HighlightContext.Provider
      value={{
        highlightedSkills,
        highlightedExperiences,
        activeSkill,
        activeExperience,
        setHighlightedSkills,
        setHighlightedExperiences,
        setActiveSkill,
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
