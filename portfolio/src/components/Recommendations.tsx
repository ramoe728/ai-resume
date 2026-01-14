import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Phone, Mail, Linkedin, User } from 'lucide-react';
import { recommendations } from '../data/resumeData';
import type { Recommendation } from '../data/resumeData';
import './Recommendations.css';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const textPreviewLength = 300;
  const needsTruncation = recommendation.text.length > textPreviewLength;
  
  const displayText = isExpanded || !needsTruncation
    ? recommendation.text
    : recommendation.text.slice(0, textPreviewLength) + '...';

  return (
    <motion.div
      className="recommendation-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {/* Profile section */}
      <div className="recommendation-header">
        <div className="recommendation-photo">
          {recommendation.photo ? (
            <img src={recommendation.photo} alt={recommendation.name} />
          ) : (
            <div className="photo-placeholder">
              <User size={32} />
            </div>
          )}
        </div>
        <div className="recommendation-author">
          <h4 className="author-name">{recommendation.name}</h4>
          <p className="author-role">{recommendation.role}</p>
          <p className="author-affiliation">{recommendation.affiliation}</p>
        </div>
      </div>

      {/* Quote/Text section */}
      <div className="recommendation-content">
        <span className="quote-mark">"</span>
        <p className="recommendation-text">{displayText}</p>
        {needsTruncation && (
          <button 
            className="read-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Contact info */}
      {(recommendation.phone || recommendation.email || recommendation.linkedIn) && (
        <div className="recommendation-contact">
          {recommendation.phone && (
            <a href={`tel:${recommendation.phone}`} className="contact-link">
              <Phone size={14} />
              <span>{recommendation.phone}</span>
            </a>
          )}
          {recommendation.email && (
            <a href={`mailto:${recommendation.email}`} className="contact-link">
              <Mail size={14} />
              <span>{recommendation.email}</span>
            </a>
          )}
          {recommendation.linkedIn && (
            <a href={recommendation.linkedIn} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Linkedin size={14} />
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function Recommendations() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Scroll by the full container width for full-width cards
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -containerWidth : containerWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="recommendations-section" id="recommendations">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>Recommendations</h2>
        <p className="section-subtitle">What colleagues and managers have to say</p>
      </motion.div>

      <div className="carousel-container">
        {/* Left scroll button */}
        <button 
          className={`scroll-btn scroll-left ${!canScrollLeft ? 'hidden' : ''}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Cards container */}
        <div 
          className="recommendations-carousel"
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
        >
          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              index={index}
            />
          ))}
        </div>

        {/* Right scroll button */}
        <button 
          className={`scroll-btn scroll-right ${!canScrollRight ? 'hidden' : ''}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Scroll indicator dots */}
      {recommendations.length > 1 && (
        <div className="carousel-dots">
          {recommendations.map((rec, index) => (
            <span key={rec.id} className="carousel-dot" />
          ))}
        </div>
      )}
    </section>
  );
}
