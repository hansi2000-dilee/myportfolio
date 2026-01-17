import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Linkedin, Github, Facebook, MessageCircle, Send } from 'lucide-react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
    const [details, setDetails] = useState(null);
    const [formData, setFormData] = useState({
        name: '', title: '', email: '', phone: '', address: '', message: ''
    });
    const [status, setStatus] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/personal_details')
            .then(res => setDetails(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setStatus('Sending...');
            await axios.post('http://localhost:5000/api/contact', formData);
            setStatus('Message Sent! I will get back to you soon.');
            setFormData({ name: '', title: '', email: '', phone: '', address: '', message: '' });
        } catch (err) {
            console.error(err);
            setStatus('Failed to send message.');
        }
    };

  return (
    <section id="contact" className="section container" style={{ position: 'relative' }}>
      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>

      <motion.div 
        className="contact-wrapper"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        style={{ background: 'rgba(20, 20, 30, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', zIndex: 1, position: 'relative' }}
      >
        <div className="contact-info">
          <h2 className="heading-gradient" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get In Touch</h2>
          <p style={{ color: '#aaa', marginBottom: '2rem', lineHeight: '1.6' }}>
            I'm currently available for freelance work or full-time opportunities. Feel free to reach out to me via email, WhatsApp, or the form below.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <div className="icon-box" style={{ background: 'rgba(147, 51, 234, 0.2)', color: '#d8b4fe' }}><Mail size={20} /></div>
              <span style={{ color: '#fff' }}>{details?.email || 'email@example.com'}</span>
            </div>
            <div className="contact-item">
              <div className="icon-box" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fde047' }}><Phone size={20} /></div>
              <span style={{ color: '#fff' }}>{details?.phone || '+94 00 000 0000'}</span>
            </div>
            <div className="contact-item">
              <div className="icon-box" style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#f9a8d4' }}><MapPin size={20} /></div>
              <span style={{ color: '#fff' }}>{details?.address || 'City, Country'}</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
              <h4 style={{ color: '#fbbf24', marginBottom: '1rem', fontSize: '1.1rem' }}>Connect via WhatsApp</h4>
              <a 
                href="https://wa.me/94775650717" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn"
                style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    background: '#25D366', 
                    color: 'white', 
                    padding: '12px 25px', 
                    borderRadius: '50px', 
                    fontSize: '1rem',
                    fontWeight: '600',
                    boxShadow: '0 5px 15px rgba(37, 211, 102, 0.3)',
                    border: 'none'
                }}
              >
                  <MessageCircle size={20} /> Chat on WhatsApp
              </a>
          </div>

          <div className="social-links" style={{ marginTop: '2.5rem' }}>
            {details?.linkedin && (
                <a href={details.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ borderColor: '#0077b5', color: '#0077b5' }}><Linkedin size={20} /></a>
            )}
            {details?.github && (
                <a href={details.github} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ borderColor: '#fff', color: '#fff' }}><Github size={20} /></a>
            )}
            {details?.facebook && (
                <a href={details.facebook} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ borderColor: '#1877f2', color: '#1877f2' }}><Facebook size={20} /></a>
            )}
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div className="form-group">
                <label style={{ color: '#d8b4fe' }}>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
             </div>
             <div className="form-group">
                <label style={{ color: '#fde047' }}>Job Title / Role</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. HR Manager" required />
             </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ color: '#f9a8d4' }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label style={{ color: '#d8b4fe' }}>Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+94 77 ..." required />
              </div>
          </div>

          <div className="form-group">
            <label style={{ color: '#fff' }}>Address (Optional)</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Your Address" />
          </div>

          <div className="form-group">
            <label style={{ color: '#fbbf24' }}>Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="How can I help you?" rows="4" required></textarea>
          </div>

          <button type="submit" className="btn" style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 50%, #fbbf24 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              marginTop: '1rem'
          }}>
            <Send size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Send Message
          </button>
          
          {status && <p style={{ marginTop: '1rem', textAlign: 'center', color: status.includes('Sent') ? '#4ade80' : '#ef4444' }}>{status}</p>}
        </form>
      </motion.div>
    </section>
  );
};

export default Contact;
