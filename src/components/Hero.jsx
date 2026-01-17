import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import axios from 'axios';
import './Hero.css';

const Hero = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/personal_details')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

// ... imports remain the same

  // Use full URL for image if it exists, else fallback
  const heroImage = data?.photo_url ? `http://localhost:5000${data.photo_url}` : null;
  const firstName = data?.name ? data.name.split(' ')[0] : 'Hansi';
  const lastName = data?.name ? data.name.split(' ')[1] : 'Dileesha';

  return (
    <section className="hero">
      <div className="container hero-container-flex">
        
        {/* Left Side: Image */}
        <motion.div 
            className="hero-image-container"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
        >
             <div className="hero-image-wrapper">
                {heroImage ? (
                    <img src={heroImage} alt="Profile" className="hero-image" />
                ) : (
                    <div className="hero-image" style={{ background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <span style={{ color: '#555' }}>No Image</span>
                    </div>
                )}
             </div>
        </motion.div>

        {/* Right Side: Text */}
        <div className="hero-content">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-subtitle"
          >
            Hello, I'm
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title"
          >
            <span style={{ display: 'inline-block' }} className="heading-gradient">{firstName}</span> <span style={{ display: 'inline-block' }}>{lastName}</span>
            <br />
            <span style={{ fontSize: '0.4em', opacity: 0.8, fontWeight: 'normal', color: 'var(--text-primary)', display: 'block', marginTop: '10px' }}>
                {data?.title || 'Full-Stack Engineer'}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hero-description"
          >
            {data?.hero_description || 'A passionate developer turning ideas into reality through code.'}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hero-buttons"
          >
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Contact Me <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </div>
      
      <a href="#about" className="scroll-indicator">
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default Hero;
