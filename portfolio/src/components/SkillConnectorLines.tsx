import React, { useEffect, useState, useCallback } from 'react';
import { useHighlight } from '../context/HighlightContext';
import { skills, experiences } from '../data/resumeData';
import './SkillConnectorLines.css';

// Category colors - matching SkillBubbles
const categoryColors: Record<string, string> = {
  language: '#6C63FF',
  framework: '#00D9FF',
  cloud: '#FF6B6B',
  database: '#4ECB71',
  specialty: '#FFB347',
};

interface ConnectionPath {
  id: string;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
}

export function SkillConnectorLines() {
  const { activeSkills, highlightedExperiences } = useHighlight();
  const [paths, setPaths] = useState<ConnectionPath[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate paths between skill bubbles and experience cards
  const calculatePaths = useCallback(() => {
    if (activeSkills.length === 0) {
      setPaths([]);
      return;
    }

    const newPaths: ConnectionPath[] = [];
    let delay = 0;

    activeSkills.forEach((skillName) => {
      // Find the skill bubble element
      const skillBubble = document.querySelector(`[data-skill="${skillName}"]`);
      if (!skillBubble) return;

      const skillRect = skillBubble.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      // Find which experiences use this skill
      const matchingExperiences = experiences.filter(exp => 
        exp.skills.some(s => s.toLowerCase() === skillName.toLowerCase())
      );

      // Get skill info for color
      const skill = skills.find(s => s.name === skillName);
      const color = skill ? categoryColors[skill.category] : '#6C63FF';

      matchingExperiences.forEach((exp) => {
        // Find the experience card element
        const expCard = document.querySelector(`[data-experience="${exp.id}"]`);
        if (!expCard) return;

        const expRect = expCard.getBoundingClientRect();

        newPaths.push({
          id: `${skillName}-${exp.id}`,
          color,
          startX: skillRect.left + skillRect.width / 2,
          startY: skillRect.bottom + scrollY,
          endX: expRect.left + expRect.width / 2,
          endY: expRect.top + scrollY,
          delay: delay * 0.1,
        });

        delay++;
      });
    });

    setPaths(newPaths);
  }, [activeSkills]);

  // Update dimensions and recalculate on scroll/resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      });
    };

    updateDimensions();
    calculatePaths();

    // Debounce scroll/resize handlers
    let timeout: ReturnType<typeof setTimeout>;
    const handleUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateDimensions();
        calculatePaths();
      }, 50);
    };

    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      clearTimeout(timeout);
    };
  }, [calculatePaths]);

  // Recalculate when active skills change
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timeout = setTimeout(() => {
      calculatePaths();
    }, 100);
    return () => clearTimeout(timeout);
  }, [activeSkills, highlightedExperiences, calculatePaths]);

  if (paths.length === 0) return null;

  // Generate a curved path with some meander
  const generatePath = (path: ConnectionPath): string => {
    const { startX, startY, endX, endY } = path;
    const midY = startY + (endY - startY) * 0.5;
    
    // Add some horizontal offset for visual interest
    const controlOffset = (endX - startX) * 0.3;
    
    // Create a bezier curve that meanders
    return `
      M ${startX} ${startY}
      C ${startX} ${startY + 50},
        ${startX + controlOffset} ${midY - 50},
        ${startX + (endX - startX) * 0.5} ${midY}
      S ${endX - controlOffset} ${endY - 100},
        ${endX} ${endY}
    `;
  };

  return (
    <>
      {/* SVG for lines - renders BEHIND skill bubbles */}
      <svg
        className="skill-connector-svg skill-connector-lines"
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <defs>
          {paths.map((path) => (
            <linearGradient
              key={`gradient-${path.id}`}
              id={`gradient-${path.id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={path.color} stopOpacity="1" />
              <stop offset="50%" stopColor={path.color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={path.color} stopOpacity="0.3" />
            </linearGradient>
          ))}
          
          {/* Glow filter for lines */}
          <filter id="glow-lines" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {paths.map((path) => (
          <g key={path.id}>
            {/* Background glow line */}
            <path
              d={generatePath(path)}
              fill="none"
              stroke={path.color}
              strokeWidth="3"
              strokeOpacity="0.8"
              filter="url(#glow-lines)"
              className="connector-path-glow"
              style={{
                animationDelay: `${path.delay}s`,
              }}
            />
            
            {/* Main animated line */}
            <path
              d={generatePath(path)}
              fill="none"
              stroke={`url(#gradient-${path.id})`}
              strokeWidth="3"
              strokeLinecap="round"
              className="connector-path"
              style={{
                animationDelay: `${path.delay}s`,
              }}
            />
          </g>
        ))}
      </svg>

      {/* SVG for dots - renders IN FRONT of skill bubbles */}
      <svg
        className="skill-connector-svg skill-connector-dots"
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        <defs>
          {/* Glow filter for dots */}
          <filter id="glow-dots" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {paths.map((path) => (
          <g key={path.id}>
            {/* Hidden path for motion */}
            <path
              id={`motion-${path.id}`}
              d={generatePath(path)}
              fill="none"
              stroke="none"
            />
            
            {/* Animated traveling dot */}
            <circle
              r="6"
              fill={path.color}
              filter="url(#glow-dots)"
              className="connector-dot"
            >
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${path.delay + 0.5}s`}
                fill="freeze"
              >
                <mpath xlinkHref={`#motion-${path.id}`} />
              </animateMotion>
              {/* Keep dot hidden until animation starts */}
              <animate
                attributeName="opacity"
                from="0"
                to="1"
                dur="0.3s"
                begin={`${path.delay + 0.5}s`}
                fill="freeze"
              />
            </circle>
          </g>
        ))}
      </svg>
    </>
  );
}
