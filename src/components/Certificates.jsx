import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, ChevronRight, ExternalLink } from 'lucide-react';
import './Projects.css'; // Reusing project styles for consistency

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/certificates')
            .then(res => {
                const sorted = res.data.sort((a, b) => b.display_order - a.display_order);
                setCertificates(sorted);
            })
            .catch(err => console.error(err));

        axios.get('http://localhost:5000/api/achievements')
            .then(res => {
                setAchievements(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    // Helper for Achievement Image Slider
    const AchievementCard = ({ ach }) => {
        const [imgIndex, setImgIndex] = useState(0);

        return (
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4 }}
                style={{ 
                    background: 'linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(30,10,40,0.9) 100%)',
                    borderRadius: '24px',
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: '1px solid rgba(147, 51, 234, 0.3)', // Purple border tint
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    position: 'relative'
                }}
            >
                {/* Decorative Gradient Border/Glow effect on hover could be added via CSS, but inline we'll stick to a nice border */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #9333ea, #ec4899, #fbbf24)' }}></div>

                {/* Image Section */}
                <div style={{ height: '300px', overflow: 'hidden', position: 'relative', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {ach.images && ach.images.length > 0 ? (
                        <AnimatePresence mode='wait'>
                            <motion.img 
                                key={imgIndex}
                                src={`http://localhost:5000${ach.images[imgIndex].image_url}`} 
                                alt={ach.title} 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'contain' // Fix: Ensure full image is visible
                                }}
                            />
                        </AnimatePresence>
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                            <Award size={64} style={{ opacity: 0.2 }} />
                        </div>
                    )}
                    
                    {/* Navigation for images */}
                    {ach.images && ach.images.length > 1 && (
                        <>
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImgIndex((prev) => (prev - 1 + ach.images.length) % ach.images.length);
                                }}
                                style={{
                                    position: 'absolute', top: '50%', left: '15px', transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.6)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)', 
                                    borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(4px)', transition: 'all 0.2s', zIndex: 10
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#fbbf24'; e.currentTarget.style.color = '#000'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.color = '#fbbf24'; }}
                             >
                                 &#8249;
                             </button>
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImgIndex((prev) => (prev + 1) % ach.images.length);
                                }}
                                style={{
                                    position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.6)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.3)',
                                    borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(4px)', transition: 'all 0.2s', zIndex: 10
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.background = '#fbbf24'; e.currentTarget.style.color = '#000'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.color = '#fbbf24'; }}
                             >
                                 &#8250;
                             </button>
                             <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '12px' }}>
                                 {ach.images.map((_, i) => (
                                     <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === imgIndex ? '#fbbf24' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}></div>
                                 ))}
                             </div>
                        </>
                    )}

                    {/* Date Badge */}
                    <div style={{ 
                        position: 'absolute', top: 15, right: 15, 
                        background: 'rgba(147, 51, 234, 0.9)', 
                        color: '#fff', 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: '600',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        {ach.date}
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
                    
                    <h3 style={{ 
                        fontSize: '1.4rem', 
                        marginBottom: '0.8rem',
                        background: 'linear-gradient(90deg, #fff, #fbbf24)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '700'
                    }}>
                        {ach.title}
                    </h3>
                    
                    <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: '1.7', flex: 1 }}>
                        {ach.description}
                    </p>

                    {/* Decorative element */}
                    <div style={{ 
                        position: 'absolute', bottom: 0, right: 0, 
                        width: '100px', height: '100px', 
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                     }}></div>
                </div>
            </motion.div>
        );
    };

    if (certificates.length === 0 && achievements.length === 0) return null;

    return (
        <section id="certificates" className="section container">
            <h2 className="heading-gradient" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>
                Certifications & Achievements
            </h2>

            {/* Certificates Subsection */}
            {certificates.length > 0 && (
                <div style={{ marginBottom: '4rem' }}>
                    <h3 style={{ color: '#d8b4fe', fontSize: '1.8rem', marginBottom: '2rem', borderLeft: '4px solid #9333ea', paddingLeft: '1rem' }}>
                        Certificates
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {certificates.map((cert, index) => (
                            <motion.div 
                                key={cert.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="project-card"
                                style={{ background: '#1c1c1c', border: '1px solid #333', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                            >
                                {/* Image Section */}
                                <div 
                                    style={{ 
                                        height: '250px', 
                                        overflow: 'hidden', 
                                        position: 'relative', 
                                        borderBottom: '1px solid #333',
                                        background: '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {cert.image_url ? (
                                        <img 
                                            src={`http://localhost:5000${cert.image_url}`} 
                                            alt={cert.title} 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'contain', 
                                                transition: 'transform 0.5s' 
                                            }}
                                            className="cert-img"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2a2a2a', color: '#555' }}>
                                            <Award size={64} color="#fbbf24" />
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.8)', color: '#fbbf24', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid #fbbf24' }}>
                                        {cert.date}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>{cert.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.9rem', fontWeight: '500' }}>
                                            <span>Issued by: {cert.issuer}</span>
                                        </div>
                                    </div>

                                    <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                                        {cert.description}
                                    </p>

                                    {cert.link && (
                                        <a 
                                            href={cert.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn"
                                            style={{ 
                                                width: '100%', 
                                                textAlign: 'center', 
                                                background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)', 
                                                color: 'white', 
                                                padding: '10px', 
                                                borderRadius: '8px', 
                                                marginTop: 'auto',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            View Credential <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements Subsection */}
            {achievements.length > 0 && (
                <div>
                     <h3 style={{ color: '#fde047', fontSize: '1.8rem', marginBottom: '2rem', borderLeft: '4px solid #fbbf24', paddingLeft: '1rem' }}>
                        Achievements
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {achievements.map((ach) => (
                            <AchievementCard key={ach.id} ach={ach} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Certificates;
