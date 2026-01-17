import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      borderTop: '1px solid rgba(255,255,255,0.05)', 
      padding: '2rem 0', 
      textAlign: 'center',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Hansi Dileesha. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
          Built with React & Framer Motion
        </p>
      </div>
    </footer>
  );
};

export default Footer;
