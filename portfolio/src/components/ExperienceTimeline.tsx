import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { experiences, skills } from '../data/resumeData';
import type { Experience } from '../data/resumeData';
import { useHighlight } from '../context/HighlightContext';
import './ExperienceTimeline.css';

// Category colors - matching SkillBubbles
const categoryColors: Record<string, string> = {
  language: '#A78BFA',
  framework: '#00D9FF',
  cloud: '#FF6B6B',
  database: '#4ECB71',
  specialty: '#FFB347',
};

// Helper to find a skill's category by name
function getSkillCategory(skillName: string): string | null {
  const skill = skills.find(s => 
    s.name.toLowerCase() === skillName.toLowerCase() ||
    s.name.toLowerCase().includes(skillName.toLowerCase()) ||
    skillName.toLowerCase().includes(s.name.toLowerCase())
  );
  return skill?.category || null;
}

interface ExperienceCardProps {
  experience: Experience;
  index: number;
  isHighlighted: boolean;
  isActive: boolean;
  activeSkills: string[];
  onHover: (id: string | null) => void;
  onSkillClick: (skillName: string) => void;
}

function ExperienceCard({ experience, index, isHighlighted, isActive, activeSkills, onHover, onSkillClick }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Auto-expand when card becomes highlighted due to skill selection
  useEffect(() => {
    if (isHighlighted && activeSkills.length > 0) {
      setIsExpanded(true);
    }
  }, [isHighlighted, activeSkills.length]);
  
  // Check if a skill tag matches any of the active skills (exact match)
  const isSkillActive = (skillName: string): boolean => {
    if (activeSkills.length === 0) return false;
    return activeSkills.some(activeSkill =>
      skillName.toLowerCase() === activeSkill.toLowerCase()
    );
  };
  
  // Get the color for a skill tag
  const getSkillColor = (skillName: string): string => {
    const category = getSkillCategory(skillName);
    return category ? categoryColors[category] : 'var(--accent-primary)';
  };

  return (
    <motion.div
      className={`experience-card ${isHighlighted ? 'highlighted' : ''} ${isActive ? 'active' : ''}`}
      data-experience={experience.id}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      onMouseEnter={() => onHover(experience.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="timeline-marker">
        <motion.div 
          className="marker-dot"
          animate={{ scale: isHighlighted || isActive ? 1.3 : 1 }}
          transition={{ duration: 0.2 }}
        />
        <div className="marker-line" />
      </div>
      
      <div className="experience-content">
        <div className="experience-header">
          <div className="experience-date">
            <Calendar size={14} />
            <span>{experience.startDate} - {experience.endDate}</span>
          </div>
          <motion.div 
            className="expand-icon"
            animate={{ rotate: isExpanded ? 90 : 0 }}
          >
            <ChevronRight size={18} />
          </motion.div>
        </div>
        
        <h3 className="experience-title">{experience.title}</h3>
        <div className="experience-company">
          <span className="company-name">{experience.company}</span>
          <span className="company-location">
            <MapPin size={12} />
            {experience.location}
          </span>
        </div>
        
        <p className="experience-description">{experience.description}</p>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="experience-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="experience-highlights">
                <h4>Key Achievements</h4>
                <ul>
                  {experience.highlights.map((highlight, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {highlight}
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="experience-skills">
                <h4>Technologies Used</h4>
                <div className="skill-tags">
                  {experience.skills.map((skill, i) => {
                    const isActiveSkill = isSkillActive(skill);
                    const skillColor = getSkillColor(skill);
                    return (
                      <motion.span
                        key={skill}
                        className={`skill-tag ${isActiveSkill ? 'skill-tag-active' : ''}`}
                        style={{
                          '--skill-color': skillColor,
                          cursor: 'pointer',
                        } as React.CSSProperties}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card expand/collapse
                          onSkillClick(skill);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {skill}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function ExperienceTimeline() {
  const { 
    highlightedExperiences, 
    activeSkills, 
    setActiveExperience,
    toggleActiveSkill,
    setHighlightedExperiences
  } = useHighlight();
  const [hoveredExperience, setHoveredExperience] = useState<string | null>(null);

  const handleHover = (id: string | null) => {
    setHoveredExperience(id);
    setActiveExperience(id);
  };

  // Handle skill tag click - toggle skill and update highlighted experiences
  const handleSkillClick = (skillName: string) => {
    toggleActiveSkill(skillName);
    
    // Calculate new active skills after toggle
    const newActiveSkills = activeSkills.includes(skillName)
      ? activeSkills.filter(s => s !== skillName)
      : [...activeSkills, skillName];
    
    if (newActiveSkills.length === 0) {
      setHighlightedExperiences([]);
    } else {
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

  // Find experiences that use any of the active skills (exact match)
  const getExperiencesForSkills = (skillNames: string[]) => {
    if (skillNames.length === 0) return [];
    return experiences
      .filter(exp => exp.skills.some(expSkill => 
        skillNames.some(skillName =>
          expSkill.toLowerCase() === skillName.toLowerCase()
        )
      ))
      .map(exp => exp.id);
  };

  const skillRelatedExperiences = getExperiencesForSkills(activeSkills);

  return (
    <section className="experience-section" id="experience">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>Professional Experience</h2>
        <p className="section-subtitle">Click on any experience to see more details</p>
      </motion.div>
      
      <div className="timeline-container">
        {experiences.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            experience={exp}
            index={index}
            isHighlighted={
              highlightedExperiences.includes(exp.id) || 
              skillRelatedExperiences.includes(exp.id)
            }
            isActive={hoveredExperience === exp.id}
            activeSkills={activeSkills}
            onHover={handleHover}
            onSkillClick={handleSkillClick}
          />
        ))}
      </div>
    </section>
  );
}
