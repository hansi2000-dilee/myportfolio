import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TechRibbon.css';

const TechRibbon = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/skills')
      .then(res => setSkills(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter skills to only include Programming, Frameworks, and Databases
  const filteredSkills = skills.filter(skill => {
      const cat = skill.category.toLowerCase();
      // Adjust keywords based on expected category names
      return cat.includes('program') || 
             cat.includes('language') || 
             cat.includes('framework') || 
             cat.includes('database') || 
             cat.includes('data'); // Catches 'Databases' or 'Data Stores'
  });

  // Duplicate the list to create seamless infinite scroll loop
  // Ensure we have enough items for scrolling
  const ribbonItems = filteredSkills.length > 0 
      ? [...filteredSkills, ...filteredSkills, ...filteredSkills, ...filteredSkills] 
      : [];
      
  if (filteredSkills.length === 0) return null; 

  if (skills.length === 0) return null;

  return (
    <div className="tech-ribbon-wrapper">
      <h3 className="tech-ribbon-title">What I’m Good At</h3>
      <div className="tech-ribbon-container">
        <div className="tech-ribbon-track">
          {ribbonItems.map((skill, index) => (
            <div key={index} className="tech-ribbon-item">
              <div className="tech-icon-wrapper">
                  {skill.icon_url ? (
                      <img 
                          src={`http://localhost:5000${skill.icon_url}`} 
                          alt={skill.skill_name} 
                          className="tech-icon"
                      />
                  ) : (
                      // Fallback: Initial letter?
                      <span style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#fff'}}>
                          {skill.skill_name.charAt(0)}
                      </span>
                  )}
              </div>
              <span className="tech-name">{skill.skill_name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechRibbon;
