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

// Get one of 20 evenly spaced connection points along the top of a card
function getConnectionPoint(cardRect: DOMRect, pathId: string): number {
  const padding = cardRect.width * 0.1;
  const usableWidth = cardRect.width - (padding * 2);
  const spacing = usableWidth / 19; // 19 gaps between 20 points
  const spotIndex = hashString(pathId) % 20;
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
}

// Generate a PCB-style path with straight lines and 45-degree angles
function generatePathD(startX: number, startY: number, endX: number, endY: number): string {
  const dx = endX - startX; // horizontal distance to travel
  const dy = endY - startY; // total vertical distance
  
  // Direction of horizontal travel: 1 for right, -1 for left
  const direction = dx >= 0 ? 1 : -1;
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isCalculating = useRef(false);

  // Calculate paths between skill bubbles and experience cards
  const calculatePaths = useCallback(() => {
    // Prevent concurrent calculations
    if (isCalculating.current) return;
    isCalculating.current = true;

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
    // Use requestAnimationFrame for smoother updates
    const frameId = requestAnimationFrame(() => {
      calculatePaths();
    });
    return () => cancelAnimationFrame(frameId);
  }, [activeSkills, calculatePaths]);

  // Memoize the SVG content to prevent unnecessary re-renders
  const linesSvgContent = useMemo(() => {
    if (paths.length === 0) return null;
    
    return (
      <>
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
              <stop offset="50%" stopColor={path.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={path.color} stopOpacity="0.4" />
            </linearGradient>
          ))}
        </defs>

        {paths.map((path) => (
          <path
            key={path.id}
            d={path.pathD}
            fill="none"
            stroke={`url(#gradient-${path.id})`}
            strokeWidth="3"
            strokeLinecap="round"
            className="connector-path"
            style={{
              animationDelay: `${path.delay}s`,
              filter: `drop-shadow(0 0 6px ${path.color})`,
            }}
          />
        ))}
      </>
    );
  }, [paths]);

  const dotsSvgContent = useMemo(() => {
    if (paths.length === 0) return null;
    
    return paths.map((path) => (
      <g key={path.id}>
        <path
          id={`motion-${path.id}`}
          d={path.pathD}
          fill="none"
          stroke="none"
        />
        
        <circle
          r="6"
          fill={path.color}
          className="connector-dot"
          style={{
            filter: `drop-shadow(0 0 4px ${path.color})`,
          }}
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            begin={`${path.delay + 0.3}s`}
            fill="freeze"
          >
            <mpath xlinkHref={`#motion-${path.id}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.2s"
            begin={`${path.delay + 0.3}s`}
            fill="freeze"
          />
        </circle>
      </g>
    ));
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
