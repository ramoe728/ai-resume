import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useHighlight } from '../context/HighlightContext';
import { skills, experiences } from '../data/resumeData';
import './SkillConnectorLines.css';

// Category colors - matching SkillBubbles
const categoryColors: Record<string, string> = {
  language: '#A78BFA',
  framework: '#00D9FF',
  cloud: '#FF6B6B',
  database: '#4ECB71',
  specialty: '#FFB347',
};

// Sanitize string for use as SVG ID (remove spaces and special characters)
function sanitizeId(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

// Simple hash function to get consistent "random" values based on string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Get one of 30 evenly spaced connection points along the top of a card
function getConnectionPoint(cardRect: DOMRect, pathId: string): number {
  const padding = cardRect.width * 0.1;
  const usableWidth = cardRect.width - (padding * 2);
  const spacing = usableWidth / 29; // 29 gaps between 30 points
  const spotIndex = hashString(pathId) % 30;
  return cardRect.left + padding + (spacing * spotIndex);
}

interface ConnectionPath {
  id: string;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  pathD: string; // Pre-computed path string
  isExiting?: boolean; // True when path is animating out
}

// Generate a PCB-style path with straight lines and 45-degree angles
function generatePathD(startX: number, startY: number, endX: number, endY: number): string {
  const dx = endX - startX; // horizontal distance to travel
  const dy = endY - startY; // total vertical distance
  const horizontalDistance = Math.abs(dx);
  
  // For 45-degree travel, horizontal and vertical movement are equal
  const diagonalVerticalTravel = horizontalDistance;
  
  // Minimum straight segments before/after diagonal
  const minTopSegment = 40;
  const minBottomSegment = 60;
  
  // Check if we have enough vertical space for proper routing
  const availableForDiagonal = dy - minTopSegment - minBottomSegment;
  
  if (availableForDiagonal < diagonalVerticalTravel || horizontalDistance < 10) {
    // Not enough room for nice 45-degree routing, use a simpler path
    // Go straight down, then diagonal at the end
    const simpleDropY = startY + dy * 0.7;
    return `M ${startX} ${startY} L ${startX} ${simpleDropY} L ${endX} ${endY}`;
  }
  
  // PCB-style routing:
  // 1. Go straight down from start
  // 2. Turn 45° toward destination (chamfer)
  // 3. Travel diagonally
  // 4. Turn 45° back to vertical (chamfer)
  // 5. Go straight down to end
  
  const y1 = startY + minTopSegment; // End of first vertical segment
  const y2 = y1 + diagonalVerticalTravel; // End of diagonal segment
  
  // Build the path with straight line segments
  return `M ${startX} ${startY} L ${startX} ${y1} L ${endX} ${y2} L ${endX} ${endY}`;
}

export function SkillConnectorLines() {
  const { activeSkills } = useHighlight();
  const [paths, setPaths] = useState<ConnectionPath[]>([]);
  const [exitingPaths, setExitingPaths] = useState<ConnectionPath[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isCalculating = useRef(false);
  const prevActiveSkillsRef = useRef<string[]>([]);

  // Calculate paths between skill bubbles and experience cards
  const calculatePaths = useCallback(() => {
    // Prevent concurrent calculations
    if (isCalculating.current) return;
    isCalculating.current = true;

    // Check if skills were deactivated
    const prevSkills = prevActiveSkillsRef.current;
    const deactivatedSkills = prevSkills.filter(s => !activeSkills.includes(s));
    
    if (deactivatedSkills.length > 0 && paths.length > 0) {
      // Find paths for deactivated skills and mark them as exiting
      const pathsToExit = paths.filter(p => 
        deactivatedSkills.some(skill => 
          p.id.toLowerCase().startsWith(sanitizeId(skill))
        )
      ).map(p => ({ ...p, isExiting: true }));
      
      if (pathsToExit.length > 0) {
        setExitingPaths(prev => [...prev, ...pathsToExit]);
        
        // Remove exiting paths after animation completes (1s)
        setTimeout(() => {
          setExitingPaths(prev => 
            prev.filter(ep => !pathsToExit.some(pte => pte.id === ep.id))
          );
        }, 1000);
      }
    }
    
    prevActiveSkillsRef.current = [...activeSkills];

    if (activeSkills.length === 0) {
      setPaths([]);
      isCalculating.current = false;
      return;
    }

    const newPaths: ConnectionPath[] = [];
    let delay = 0;
    const scrollY = window.scrollY;

    // Batch DOM reads
    const skillElements: Map<string, DOMRect> = new Map();
    const expElements: Map<string, DOMRect> = new Map();

    activeSkills.forEach((skillName) => {
      const skillBubble = document.querySelector(`[data-skill="${skillName}"]`);
      if (skillBubble) {
        skillElements.set(skillName, skillBubble.getBoundingClientRect());
      }
    });

    experiences.forEach((exp) => {
      const expCard = document.querySelector(`[data-experience="${exp.id}"]`);
      if (expCard) {
        expElements.set(exp.id, expCard.getBoundingClientRect());
      }
    });

    // Now calculate paths without additional DOM queries
    activeSkills.forEach((skillName) => {
      const skillRect = skillElements.get(skillName);
      if (!skillRect) return;

      const matchingExperiences = experiences.filter(exp => 
        exp.skills.some(s => s.toLowerCase() === skillName.toLowerCase())
      );

      const skill = skills.find(s => s.name === skillName);
      const color = skill ? categoryColors[skill.category] : '#A78BFA';

      matchingExperiences.forEach((exp) => {
        const expRect = expElements.get(exp.id);
        if (!expRect) return;

        // Sanitize ID for SVG compatibility (no spaces or special chars)
        const pathId = sanitizeId(`${skillName}-${exp.id}`);
        const startX = skillRect.left + skillRect.width / 2;
        const startY = skillRect.bottom + scrollY;
        const endX = getConnectionPoint(expRect, pathId);
        const endY = expRect.top + scrollY;

        newPaths.push({
          id: pathId,
          color,
          startX,
          startY,
          endX,
          endY,
          delay: Math.min(delay * 0.05, 0.3), // Cap delay to reduce stagger time
          pathD: generatePathD(startX, startY, endX, endY),
        });

        delay++;
      });
    });

    setPaths(newPaths);
    isCalculating.current = false;
  }, [activeSkills]);

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      });
    };

    updateDimensions();
    calculatePaths();

    // Only recalculate on resize (not scroll - paths use absolute positions)
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateDimensions();
        calculatePaths();
      }, 200); // Longer debounce for resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [calculatePaths]);

  // Recalculate when active skills change
  useEffect(() => {
    // Wait for layout animations to complete (300ms) before calculating paths
    // This ensures connector lines draw from the final position of skill bubbles
    const timeoutId = setTimeout(() => {
      calculatePaths();
    }, 350); // Slightly longer than the 300ms layout animation
    
    return () => clearTimeout(timeoutId);
  }, [activeSkills, calculatePaths]);

  // Watch for experience card height changes (expand/collapse)
  useEffect(() => {
    if (activeSkills.length === 0) return;

    const experienceSection = document.getElementById('experience');
    if (!experienceSection) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;
    
    const resizeObserver = new ResizeObserver(() => {
      // Debounce the recalculation
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setDimensions({
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        });
        calculatePaths();
      }, 350); // Wait for expand/collapse animation
    });

    resizeObserver.observe(experienceSection);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, [activeSkills.length, calculatePaths]);

  // Combine active paths and exiting paths for rendering
  const allPaths = useMemo(() => [...paths, ...exitingPaths], [paths, exitingPaths]);

  // Memoize the SVG content to prevent unnecessary re-renders
  const linesSvgContent = useMemo(() => {
    if (allPaths.length === 0) return null;
    
    return (
      <>
        <defs>
          {allPaths.map((path) => (
            <linearGradient
              key={`gradient-${path.id}`}
              id={`gradient-${path.id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={path.color} stopOpacity="1" />
              <stop offset="50%" stopColor={path.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={path.color} stopOpacity="0.4" />
            </linearGradient>
          ))}
        </defs>

        {allPaths.map((path) => (
          <path
            key={path.id}
            d={path.pathD}
            fill="none"
            stroke={`url(#gradient-${path.id})`}
            strokeWidth="3"
            strokeLinecap="round"
            className={path.isExiting ? 'connector-path-exit' : 'connector-path'}
            style={{
              animationDelay: path.isExiting ? '0s' : `${path.delay}s`,
              filter: `drop-shadow(0 0 6px ${path.color})`,
            }}
          />
        ))}
      </>
    );
  }, [allPaths]);

  const dotsSvgContent = useMemo(() => {
    if (paths.length === 0) return null;
    
    const travelDuration = 2; // seconds for dot to travel the path
    
    return paths.map((path) => {
      const startTime = path.delay + 0.3;
      
      return (
        <g key={path.id}>
          {/* Hidden path for motion */}
          <path
            id={`motion-${path.id}`}
            d={path.pathD}
            fill="none"
            stroke="none"
          />
          
          {/* Traveling dot */}
          <circle
            r="6"
            fill={path.color}
            className="connector-dot"
            style={{
              filter: `drop-shadow(0 0 4px ${path.color})`,
            }}
          >
            {/* Motion along the path */}
            <animateMotion
              dur={`${travelDuration}s`}
              repeatCount="indefinite"
              begin={`${startTime}s`}
              fill="freeze"
            >
              <mpath xlinkHref={`#motion-${path.id}`} />
            </animateMotion>
            {/* Initial fade in */}
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              dur="0.2s"
              begin={`${startTime}s`}
              fill="freeze"
            />
            {/* Shrink as dot arrives (absorption effect) - starts at 95%, gone by 100% */}
            <animate
              attributeName="r"
              values="6;6;6;0;6"
              keyTimes="0;0.05;0.95;1;1"
              dur={`${travelDuration}s`}
              repeatCount="indefinite"
              begin={`${startTime}s`}
            />
            {/* Fade out as dot arrives */}
            <animate
              attributeName="opacity"
              values="1;1;1;0;1"
              keyTimes="0;0.05;0.95;1;1"
              dur={`${travelDuration}s`}
              repeatCount="indefinite"
              begin={`${startTime}s`}
            />
          </circle>
          
          {/* Border color flash at connection point - synced to dot arrival */}
          <line
            x1={path.endX}
            y1={path.endY}
            x2={path.endX}
            y2={path.endY}
            stroke={path.color}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0"
            style={{
              filter: `drop-shadow(0 0 10px ${path.color})`,
            }}
          >
            {/* Flash when dot arrives - fade out wraps into next cycle */}
            <animate
              attributeName="opacity"
              values="0.5;0;0;1;0.7"
              keyTimes="0;0.15;0.98;0.99;1"
              dur={`${travelDuration}s`}
              repeatCount="indefinite"
              begin={`${startTime}s`}
            />
            {/* Spread left - reset at start, spread at end */}
            <animate
              attributeName="x1"
              values={`${path.endX - 50};${path.endX};${path.endX};${path.endX - 30}`}
              keyTimes="0;0.15;0.98;1"
              dur={`${travelDuration}s`}
              repeatCount="indefinite"
              begin={`${startTime}s`}
            />
            {/* Spread right - reset at start, spread at end */}
            <animate
              attributeName="x2"
              values={`${path.endX + 50};${path.endX};${path.endX};${path.endX + 30}`}
              keyTimes="0;0.15;0.98;1"
              dur={`${travelDuration}s`}
              repeatCount="indefinite"
              begin={`${startTime}s`}
            />
          </line>
        </g>
      );
    });
  }, [paths]);

  if (paths.length === 0) return null;

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
        {linesSvgContent}
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
        {dotsSvgContent}
      </svg>
    </>
  );
}
