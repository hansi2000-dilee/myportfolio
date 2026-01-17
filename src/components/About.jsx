import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Award, Code, Users, Coffee } from 'lucide-react';
import './About.css';

const About = () => {
  const [details, setDetails] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/personal_details')
      .then(res => setDetails(res.data))
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { icon: <Award size={32} />, value: details.years_experience || "02+", label: "Years Experience" },
    { icon: <Code size={32} />, value: details.projects_completed || "20+", label: "Projects Completed" },
    { icon: <Users size={32} />, value: details.happy_clients || "05+", label: "Happy Clients" },
    { icon: <Coffee size={32} />, value: details.certifications || "10+", label: "Certifications" },
  ];

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="about-title">About Me</h2>
        
        <div className="about-content">
          <p className="about-description">
            {details.description || "I am a passionate Full-Stack Developer with a knack for building beautiful and functional web applications. I specialize in React, Node.js, and modern UI/UX design. My goal is to deliver high-quality digital solutions that solve real-world problems."}
          </p>
        </div>

        <div className="about-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon-wrapper">
                {stat.icon}
              </div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
