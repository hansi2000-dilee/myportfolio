import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Layout, Settings } from 'lucide-react';
import axios from 'axios';
import './Skills.css';

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/skills')
      .then(res => setSkills(res.data))
      .catch(err => console.error(err));
  }, []);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.skill_name);
    return acc;
  }, {});

  const getIcon = (category) => {
      const lower = category.toLowerCase();
      if (lower.includes('core') || lower.includes('language')) return <Code2 size={24} />;
      if (lower.includes('data') || lower.includes('back')) return <Database size={24} />;
      if (lower.includes('tool')) return <Settings size={24} />;
      return <Layout size={24} />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="skills" className="section container">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <h2 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          Technical Expertise
        </h2>
        
        <div className="skills-grid">
          {Object.keys(groupedSkills).map((category, index) => (
            <motion.div key={index} variants={itemVariants} className="skill-category">
              <h3>{getIcon(category)} {category}</h3>
              <div className="skill-tags">
                {groupedSkills[category].map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </motion.div>
          ))}
          {/* Fallback if no skills in DB yet */}
          {skills.length === 0 && <p className="text-center" style={{gridColumn: '1/-1', textAlign: 'center'}}>Loading skills or no skills found...</p>}
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;
