import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, FileDown } from 'lucide-react';
import { profile, education } from '../data/resumeData';
import './Hero.css';

export function Hero() {
  return (
    <section className="hero-section">
      {/* Animated background */}
      <div className="hero-bg">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
        <div className="grid-pattern" />
      </div>
      
      <div className="hero-content">
        <motion.div
          className="hero-intro"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="profile-image-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="profile-image">
              <div className="profile-photo" />
            </div>
            <div className="profile-ring" />
          </motion.div>
          
          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {profile.name}
          </motion.h1>
          
          <motion.div
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="title-text">{profile.title}</span>
            <span className="title-divider">•</span>
            <span className="title-years">{profile.yearsExperience}</span>
          </motion.div>
          
          <motion.p
            className="hero-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {profile.summary}
          </motion.p>
          
          <motion.div
            className="hero-contact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <a href={`mailto:${profile.email}`} className="contact-item">
              <Mail size={18} />
              <span>{profile.email}</span>
            </a>
            <a href={`tel:${profile.phone}`} className="contact-item">
              <Phone size={18} />
              <span>{profile.phone}</span>
            </a>
            <div className="contact-item">
              <MapPin size={18} />
              <span>{profile.location}</span>
            </div>
            <a 
              href="https://drive.google.com/uc?export=download&id=1406WoK-Z84UWhk1mdygm6pNxvvNpJxGt" 
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item resume-download"
            >
              <FileDown size={18} />
              <span>Resume</span>
            </a>
          </motion.div>
          
          <motion.div
            className="hero-education"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6, type: 'spring' }}
          >
            <div className="education-card">
              <div className="education-mascot">
                <img src="/byu-retro.png" alt="BYU Cougar" />
              </div>
              <div className="education-medallion">
                <img src="/byu-brigham-young-university-medallion.png" alt="BYU Seal" />
              </div>
              <div className="education-details">
                <span className="education-degree">{education.degree}</span>
                <span className="education-field">{education.field}</span>
                <div className="education-meta">
                  <span className="education-school">{education.school}</span>
                  <span className="education-years">{education.years}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="hero-languages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Globe size={16} />
            <span>Languages: {profile.languages.join(' • ')}</span>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span>Scroll to explore</span>
          <motion.div
            className="scroll-arrow"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
