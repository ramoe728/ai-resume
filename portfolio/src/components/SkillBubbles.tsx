import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { skills, experiences } from '../data/resumeData';
import type { Skill } from '../data/resumeData';
import { useHighlight } from '../context/HighlightContext';
import './SkillBubbles.css';

// Category colors
const categoryColors: Record<string, string> = {
  language: '#6C63FF',
  framework: '#00D9FF',
  cloud: '#FF6B6B',
  database: '#4ECB71',
  specialty: '#FFB347',
};

interface BubbleProps {
  skill: Skill;
  index: number;
  isHighlighted: boolean;
  isActive: boolean;
  onClick: () => void;
}

function Bubble({ skill, index, isHighlighted, isActive, onClick }: BubbleProps) {
  // Size based on proficiency (min 60px, max 110px)
  const size = 60 + (skill.proficiency / 100) * 50;
  
  return (
    <motion.div
      className={`skill-bubble ${isHighlighted ? 'highlighted' : ''} ${isActive ? 'active' : ''}`}
      style={{
        width: size,
        height: size,
        '--bubble-color': categoryColors[skill.category],
      } as React.CSSProperties}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1.15 : 1, 
        opacity: 1,
      }}
      transition={{ 
        delay: index * 0.05,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <span className="skill-name">{skill.name}</span>
      
      {/* Glow effect for highlighted */}
      {(isHighlighted || isActive) && (
        <motion.div
          className="bubble-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}

export function SkillBubbles() {
  const { 
    highlightedSkills, 
    activeSkills, 
    toggleActiveSkill,
    setActiveSkills,
    setHighlightedExperiences 
  } = useHighlight();
  
  // Clear all active skills
  const handleClearAll = () => {
    setActiveSkills([]);
    setHighlightedExperiences([]);
  };
  
  const [filter, setFilter] = useState<string | null>(null);
  
  const categories = [
    { id: null, label: 'All' },
    { id: 'language', label: 'Languages' },
    { id: 'framework', label: 'Frameworks' },
    { id: 'cloud', label: 'Cloud' },
    { id: 'database', label: 'Database' },
    { id: 'specialty', label: 'Specialties' },
  ];
  
  const filteredSkills = filter 
    ? skills.filter(s => s.category === filter)
    : skills;
  
  const handleBubbleClick = (skillName: string) => {
    // Toggle the skill in/out of active skills
    toggleActiveSkill(skillName);
    
    // Update highlighted experiences based on all active skills after toggle
    const newActiveSkills = activeSkills.includes(skillName)
      ? activeSkills.filter(s => s !== skillName)
      : [...activeSkills, skillName];
    
    if (newActiveSkills.length === 0) {
      setHighlightedExperiences([]);
    } else {
      // Find experiences that match ANY of the active skills (exact match)
      const relatedExperiences = experiences
        .filter(exp => exp.skills.some(expSkill => 
          newActiveSkills.some(activeSkill =>
            expSkill.toLowerCase() === activeSkill.toLowerCase()
          )
        ))
        .map(exp => exp.id);
      setHighlightedExperiences(relatedExperiences);
    }
  };

  const isSkillHighlighted = (skillName: string) => {
    return highlightedSkills.some(s => 
      s.toLowerCase().includes(skillName.toLowerCase()) ||
      skillName.toLowerCase().includes(s.toLowerCase())
    );
  };

  return (
    <section className="skills-section" id="skills">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>Skills & Expertise</h2>
        <p className="section-subtitle">Click a skill to see related experience</p>
      </motion.div>
      
      {/* Category filter */}
      <motion.div 
        className="skill-filters"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {categories.map(cat => (
          <button
            key={cat.id ?? 'all'}
            className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
            onClick={() => setFilter(cat.id)}
            style={{
              '--filter-color': cat.id ? categoryColors[cat.id] : 'var(--accent-primary)'
            } as React.CSSProperties}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>
      
      {/* Bubbles container */}
      <div className="bubbles-container">
        <div className="bubbles-grid">
          {filteredSkills.map((skill, index) => (
            <Bubble
              key={skill.id}
              skill={skill}
              index={index}
              isHighlighted={isSkillHighlighted(skill.name)}
              isActive={activeSkills.includes(skill.name)}
              onClick={() => handleBubbleClick(skill.name)}
            />
          ))}
          
          {/* Clear all button - appears when skills are selected */}
          <AnimatePresence>
            {activeSkills.length > 0 && (
              <motion.div
                className="clear-all-bubble"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.1 }}
                onClick={handleClearAll}
                title="Clear all selected skills"
              >
                <X size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Legend */}
      <motion.div 
        className="skill-legend"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            <span className="legend-label">{cat}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
