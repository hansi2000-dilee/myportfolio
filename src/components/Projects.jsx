import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';
import axios from 'axios';
import './Projects.css';

const ProjectCard = ({ project, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Handle both old (string check) and new (object with image_url) formats
  const rawImages = project.images && project.images.length > 0 
      ? project.images 
      : (project.image_url ? [project.image_url] : []);
      
  const images = rawImages.map(img => (typeof img === 'string' ? img : img.image_url));
  
  const [isHovered, setIsHovered] = useState(false);

  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Slower speed (5s)

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const nextImage = (e) => {
      e?.stopPropagation();
      setDirection(1);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e) => {
      e?.stopPropagation();
      setDirection(-1);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <motion.div 
      className="project-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
      transition={{ duration: 0.4 }}
    >
      <div 
        className="project-image-container" 
        style={{ 
          position: 'relative', 
          height: '240px', // Slightly taller
          overflow: 'hidden', 
          background: '#0a0a0a',
          borderBottom: '1px solid #333' // Subtle border instead of thick yellow
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images.length > 0 ? (
            <>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img 
                        key={currentImageIndex}
                        src={`http://localhost:5000${images[currentImageIndex]}`} 
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.4 },
                          scale: { duration: 0.4 }
                        }}
                        alt={project.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
                    />
                </AnimatePresence>
                
                {/* Overlay Gradient for text readability if needed later, or just style */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', pointerEvents: 'none' }}></div>

                {images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="slider-btn prev" style={{
                            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(0, 0, 0, 0.6)', color: 'white', border: 'none', borderRadius: '50%', 
                            width: '32px', height: '32px', cursor: 'pointer', zIndex: 2,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(4px)', transition: 'background 0.3s'
                        }}>‹</button>
                        
                        <button onClick={nextImage} className="slider-btn next" style={{
                            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(0, 0, 0, 0.6)', color: 'white', border: 'none', borderRadius: '50%', 
                            width: '32px', height: '32px', cursor: 'pointer', zIndex: 2,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(4px)', transition: 'background 0.3s'
                        }}>›</button>

                        <div className="slider-dots" style={{
                            position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
                            display: 'flex', gap: '6px', zIndex: 2
                        }}>
                            {images.map((_, idx) => (
                                <span key={idx} 
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                    style={{
                                        display: 'block', width: '8px', height: '8px', borderRadius: '50%',
                                        backgroundColor: idx === currentImageIndex ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                                        cursor: 'pointer', transition: 'all 0.3s'
                                    }} 
                                />
                            ))}
                        </div>
                    </>
                )}
            </>
        ) : (
            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Layers size={40} color="#9333ea" />
            </div>
        )}
      </div>

      <div className="project-content" style={{ background: '#1c1c1c', padding: '1.5rem', position: 'relative' }}>
        <h3 className="project-title" style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{project.title}</h3>
        
        {/* Used Skills */}
        <div className="project-tech-wrapper" style={{ marginBottom: '1rem' }}>
             <div className="project-tech" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
               {project.technologies && project.technologies.split(',').map((t, i) => (
                 <span key={i} className="tech-tag" style={{
                    fontSize: '0.7rem', 
                    color: '#9333ea', 
                    background: 'rgba(147, 51, 234, 0.1)', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    border: '1px solid rgba(147, 51, 234, 0.2)'
                 }}>{t.trim()}</span>
               ))}
             </div>
        </div>

        <p className="project-desc" style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', minHeight: '60px' }}>
            {project.description.length > 120 ? project.description.substring(0, 120) + '...' : project.description}
        </p>
        
        <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-3d" style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 0',
                background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                color: 'white',
                fontWeight: '600',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s',
                border: 'none',
                fontSize: '0.9rem'
            }}>
               Live Demo
            </a>
          )}
          {project.demo_link && (
             <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="btn-3d" style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 0',
                background: '#fbbf24',
                color: '#111',
                fontWeight: '600',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s',
                border: 'none',
                fontSize: '0.9rem'
             }}>
               Demo Video
             </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => {
          setProjects(res.data);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setError('Failed to load projects');
          setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign:'center', padding:'50px', color:'white'}}>Loading projects...</div>;
  if (error) return <div style={{textAlign:'center', padding:'50px', color:'red'}}>{error}</div>;

  return (
    <section id="projects" className="section container">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ 
                color: '#fbbf24', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                letterSpacing: '2px', 
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem'
            }}>
                Portfolio
            </span>
            <h2 className="heading-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>
              Featured Projects
            </h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          {projects.length === 0 && <p style={{gridColumn: '1/-1', textAlign: 'center', color: '#aaa'}}>No projects added yet.</p>}
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;
