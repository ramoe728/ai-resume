import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Mail, Linkedin, User } from 'lucide-react';
import { references } from '../data/resumeData';
import type { Reference } from '../data/resumeData';
import './References.css';

interface ReferenceCardProps {
  reference: Reference;
  index: number;
}

function ReferenceCard({ reference, index }: ReferenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const textPreviewLength = 300;
  const needsTruncation = reference.text.length > textPreviewLength;
  
  const displayText = isExpanded || !needsTruncation
    ? reference.text
    : reference.text.slice(0, textPreviewLength) + '...';

  return (
    <motion.div
      className="reference-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {/* Profile section */}
      <div className="reference-header">
        <div className="reference-photo">
          {reference.photo ? (
            <img src={reference.photo} alt={reference.name} />
          ) : (
            <div className="photo-placeholder">
              <User size={32} />
            </div>
          )}
        </div>
        <div className="reference-author">
          <h4 className="author-name">{reference.name}</h4>
          <p className="author-role">{reference.role}</p>
          <p className="author-affiliation">{reference.affiliation}</p>
        </div>
      </div>

      {/* Quote/Text section */}
      <div className="reference-content">
        <span className="quote-mark">"</span>
        <p className="reference-text">{displayText}</p>
        {needsTruncation && (
          <button 
            className="read-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Contact info - phone numbers hidden for privacy */}
      {(reference.email || reference.linkedIn) && (
        <div className="reference-contact">
          {reference.email && (
            <a href={`mailto:${reference.email}`} className="contact-link">
              <Mail size={14} />
              <span>{reference.email}</span>
            </a>
          )}
          {reference.linkedIn && (
            <a href={reference.linkedIn} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Linkedin size={14} />
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function References() {
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
    <section className="references-section" id="references">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>References</h2>
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
          className="references-carousel"
          ref={scrollContainerRef}
          onScroll={updateScrollButtons}
        >
          {references.map((ref, index) => (
            <ReferenceCard
              key={ref.id}
              reference={ref}
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
      {references.length > 1 && (
        <div className="carousel-dots">
          {references.map((ref) => (
            <span key={ref.id} className="carousel-dot" />
          ))}
        </div>
      )}
    </section>
  );
}
