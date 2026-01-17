import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import axios from 'axios';
import './Experience.css';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/experience')
      .then(res => setExperiences(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="experience" className="section container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          Professional Journey
        </h2>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.id} 
              className="timeline-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date"><Calendar size={14} style={{ display: 'inline', marginRight: '5px' }} />{exp.duration}</span>
                <h3 className="timeline-role">{exp.role}</h3>
                <div className="timeline-company">{exp.company}</div>
                <p style={{ color: '#9ca3af', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
          {experiences.length === 0 && <p style={{textAlign: 'center'}}>Loading experience...</p>}
        </div>
      </motion.div>
    </section>
  );
};

export default Experience;
