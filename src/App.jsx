import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About'; // Import About
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TechRibbon from './components/TechRibbon'; // Import

import ComplexBackground from './components/ComplexBackground';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Scroll to top
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  };
  
  const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
    useEffect(() => {
      // Hide default cursor when this component is active (Main Site)
      document.body.style.cursor = 'none';
  
      const style = document.createElement('style');
      style.innerHTML = `* { cursor: none !important; }`;
      style.id = 'custom-cursor-style';
      document.head.appendChild(style);
  
      const mouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
  
      window.addEventListener("mousemove", mouseMove);
      
      return () => {
        // Cleanup: Show default cursor again when leaving Main Site (e.g. going to Admin)
        document.body.style.cursor = 'auto';
        const existingStyle = document.getElementById('custom-cursor-style');
        if (existingStyle) existingStyle.remove();
        window.removeEventListener("mousemove", mouseMove);
      };
    }, []);
  
    return (
      <>
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            transform: `translate(${mousePosition.x - 5}px, ${mousePosition.y - 5}px)`,
            pointerEvents: 'none',
            zIndex: 10000,
            mixBlendMode: 'difference'
          }}
        />
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--accent-primary)',
            backgroundColor: 'rgba(147, 51, 234, 0.1)',
            transform: `translate(${mousePosition.x - 20}px, ${mousePosition.y - 20}px)`,
            transition: 'transform 0.15s ease-out',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.4)'
          }}
        />
      </>
    );
  };

const MainLayout = () => {
  return (
    <>
      <CustomCursor />
      <ComplexBackground />
      <Navbar />
      <Hero />
      <About />
      <TechRibbon />
      <Skills />
      <Experience />
      <Projects />
      <Certificates />
      <Contact />
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
