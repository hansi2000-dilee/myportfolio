import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash, Trash2, LogOut, Save, Edit2, X, Layers } from 'lucide-react';
import '../Projects.css'; // Reusing
import '../Skills.css'; // Reusing
import './Admin.css'; // New Admin Styles

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [details, setDetails] = useState({
    name: '', title: '', description: '', hero_description: '', email: '', phone: '', address: '', linkedin: '', github: '', facebook: '',
    years_experience: '', projects_completed: '', happy_clients: '', certifications: ''
  });
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Forms
  const [newExperience, setNewExperience] = useState({ role: '', company: '', duration: '', description: '' });
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [newSkill, setNewSkill] = useState({ category: '', skill_name: '', customCategory: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', link: '', demo_link: '', images: [], existingImages: [] });
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState({ id: null, name: '' });
  const [photo, setPhoto] = useState(null);
  const [cv, setCv] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]); // Refetch when tab changes to ensure fresh data

  const fetchData = async () => {
    try {
      // Independent fetches to prevent one failure from blocking others
      const [resDetails, resSkills, resCats, resProjects, resExp, resMessages, resCerts, resAchieve] = await Promise.allSettled([
          axios.get('http://localhost:5000/api/personal_details'),
          axios.get('http://localhost:5000/api/skills'),
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/projects'),
          axios.get('http://localhost:5000/api/experience'),
          axios.get('http://localhost:5000/api/messages', getAuthHeader()),
          axios.get('http://localhost:5000/api/certificates'),
          axios.get('http://localhost:5000/api/achievements')
      ]);

      if (resDetails.status === 'fulfilled') setDetails(resDetails.value.data);
      if (resSkills.status === 'fulfilled') setSkills(resSkills.value.data);
      if (resCats.status === 'fulfilled') setCategories(resCats.value.data);
      if (resProjects.status === 'fulfilled') setProjects(resProjects.value.data);
      if (resExp.status === 'fulfilled') setExperiences(resExp.value.data);
      
      if (resMessages.status === 'fulfilled') {
          setMessages(resMessages.value.data);
      } else {
          console.warn("Failed to fetch messages:", resMessages.reason);
      }

      if (resCerts.status === 'fulfilled') setCertificates(resCerts.value.data);
      if (resAchieve.status === 'fulfilled') setAchievements(resAchieve.value.data);

    } catch (err) {
      console.error("Critical error in fetchData:", err);
    }
  };

  // ... (getAuthHeader, handleLogout, updateDetails, categories logic etc. remain same) ...
  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const moveCertificate = async (id, direction) => {
    const index = certificates.findIndex(c => c.id === id);
    if (index === -1) return;
    
    // Create copy for manipulation
    const newCerts = [...certificates];
    const item = newCerts[index];
    
    let targetIndex = -1;
    // Current list is rendered based on sorted state (display_order DESC)
    // So index 0 is top (highest order).
    // 'up' means visually moving up (index becomes lower - 1)
    // 'down' means visually moving down (index becomes higher + 1)
    if (direction === 'up') targetIndex = index - 1;
    if (direction === 'down') targetIndex = index + 1;
    
    if (targetIndex < 0 || targetIndex >= newCerts.length) return;
    
    const targetItem = newCerts[targetIndex];
    
    // Swap positions in array
    newCerts[index] = targetItem;
    newCerts[targetIndex] = item;
    
    // Re-calculate display_orders for ALL items based on their new array position
    // We sort by display_order DESC. So top item (idx 0) needs HIGHEST display_order.
    const updates = newCerts.map((cert, idx) => ({
        id: cert.id,
        display_order: newCerts.length - idx
    }));
    
    try {
        await axios.put('http://localhost:5000/api/certificates/reorder', { items: updates }, getAuthHeader());
        // Optimistically update
        setCertificates(newCerts);
        fetchData();
    } catch (err) {
        alert('Error moving item');
    }
  };
  
  // --- Details ---
  const updateDetails = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(details).forEach(key => formData.append(key, details[key]));
    if (photo) formData.append('photo', photo);
    if (cv) formData.append('cv', cv);

    try {
      await axios.put('http://localhost:5000/api/personal_details', formData, getAuthHeader());
      alert('Details Updated!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error updating details');
    }
  };

  // --- Categories ---
  const addCategory = async (e) => {
      e.preventDefault();
      try {
          await axios.post('http://localhost:5000/api/categories', { name: newCategory }, getAuthHeader());
          setNewCategory('');
          fetchData();
      } catch (err) {
          alert('Error adding category');
      }
  };

  const updateCategory = async () => {
      try {
          await axios.put(`http://localhost:5000/api/categories/${editCategory.id}`, { name: editCategory.name }, getAuthHeader());
          setEditCategory({ id: null, name: '' });
          fetchData();
      } catch (err) {
          alert('Error updating category');
      }
  };

  const deleteCategory = async (id) => {
      if (!window.confirm("Deleting this category will DELETE ALL SKILLS belonging to it! Are you sure?")) return;
      try {
          await axios.delete(`http://localhost:5000/api/categories/${id}`, getAuthHeader());
          fetchData();
      } catch (err) {
          alert('Error deleting category');
      }
  };

  // --- Experience ---
  const addExperience = async (e) => {
    e.preventDefault();
    try {
        if (editingExperienceId) {
            await axios.put(`http://localhost:5000/api/experience/${editingExperienceId}`, newExperience, getAuthHeader());
        } else {
            // New items should probably get max display_order + 1
            await axios.post('http://localhost:5000/api/experience', newExperience, getAuthHeader());
        }
        setNewExperience({ role: '', company: '', duration: '', description: '' });
        setEditingExperienceId(null);
        fetchData();
    } catch (err) {
        alert('Error saving experience');
    }
  };

  const startEditExperience = (exp) => {
      setEditingExperienceId(exp.id);
      setNewExperience({ role: exp.role, company: exp.company, duration: exp.duration, description: exp.description });
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditExperience = () => {
        setEditingExperienceId(null);
        setNewExperience({ role: '', company: '', duration: '', description: '' });
  };

  const deleteExperience = async (id) => {
      if (!window.confirm('Are you sure?')) return;
      try {
          await axios.delete(`http://localhost:5000/api/experience/${id}`, getAuthHeader());
          fetchData();
      } catch (err) {
          alert('Error deleting experience');
      }
  };

  const moveExperience = async (id, direction) => {
    const index = experiences.findIndex(e => e.id === id);
    if (index === -1) return;
    
    // Create copy for manipulation
    const newExperiences = [...experiences];
    const item = newExperiences[index];
    
    let targetIndex = -1;
    // Current list is rendered based on sorted state interactions
    // BUT 'experiences' in state comes from DB sorted by display_order DESC.
    // So index 0 is top.
    if (direction === 'up') targetIndex = index - 1;
    if (direction === 'down') targetIndex = index + 1;
    
    if (targetIndex < 0 || targetIndex >= newExperiences.length) return;
    
    const targetItem = newExperiences[targetIndex];
    
    // Swap positions in array
    newExperiences[index] = targetItem;
    newExperiences[targetIndex] = item;
    
    // Re-calculate display_orders for ALL items based on their new array position
    // We sort by display_order DESC. So top item (idx 0) needs HIGHEST display_order.
    const updates = newExperiences.map((exp, idx) => ({
        id: exp.id,
        display_order: newExperiences.length - idx // Top gets max, bottom gets 1
    }));
    
    try {
        await axios.put('http://localhost:5000/api/experience/reorder', { items: updates }, getAuthHeader());
        fetchData();
    } catch (err) {
        alert('Error moving item');
    }
  };


  // --- Skills ---
  const [skillIcon, setSkillIcon] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);

  const addSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.category) {
        alert("Please select a category");
        return;
    }

    const formData = new FormData();
    formData.append('category', newSkill.category);
    formData.append('skill_name', newSkill.skill_name);
    if (skillIcon) formData.append('icon', skillIcon);

    try {
      if (editingSkillId) {
        await axios.put(`http://localhost:5000/api/skills/${editingSkillId}`, formData, getAuthHeader());
      } else {
        await axios.post('http://localhost:5000/api/skills', formData, getAuthHeader());
      }
      setNewSkill({ category: '', skill_name: '', customCategory: '' });
      setSkillIcon(null);
      setEditingSkillId(null);
      fetchData();
    } catch (err) {
      console.error('Save Skill Error:', err);
      alert(err.response?.data?.error || 'Error saving skill');
    }
  };

  const startEditSkill = (skill) => {
      setEditingSkillId(skill.id);
      setNewSkill({ category: skill.category, skill_name: skill.skill_name, customCategory: '' });
      setSkillIcon(null); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEditSkill = () => {
      setEditingSkillId(null);
      setNewSkill({ category: '', skill_name: '', customCategory: '' });
      setSkillIcon(null);
  };

  const deleteSkill = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/skills/${id}`, getAuthHeader());
      fetchData();
    } catch (err) {
      alert('Error deleting skill');
    }
  };

  // --- Projects ---
  // --- Projects ---
  const [editingProjectId, setEditingProjectId] = useState(null); // Local state for this block if not global, but better to put with others. 
  // Actually, I cannot put useState inside a function like this easily if I'm replacing a block *inside* the component body but not at top. 
  // Code snippet shows `addProject` is inside `Dashboard` component.
  // I will add the functions here. I will add `const [editingProjectId, setEditingProjectId] = useState(null);` at the top of the file in a separate step or just assume it is added? 
  // I MUST add the state. I will use a separate tool call for state.

  const addProject = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newProject.title);
    formData.append('description', newProject.description);
    formData.append('technologies', newProject.technologies);
    formData.append('link', newProject.link);
    formData.append('demo_link', newProject.demo_link);
    
    if (newProject.images && newProject.images.length > 0) {
        for (let i = 0; i < newProject.images.length; i++) {
             formData.append('images', newProject.images[i]);
        }
    }

    try {
      if (editingProjectId) {
         await axios.put(`http://localhost:5000/api/projects/${editingProjectId}`, formData, getAuthHeader());
      } else {
         await axios.post('http://localhost:5000/api/projects', formData, getAuthHeader());
      }
      setNewProject({ title: '', description: '', technologies: '', link: '', demo_link: '', images: [], existingImages: [] });
      setEditingProjectId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error saving project');
    }
  };

  const startEditProject = (project) => {
      setEditingProjectId(project.id);
      setNewProject({ 
          title: project.title, 
          description: project.description, 
          technologies: project.technologies, 
          link: project.link, 
          demo_link: project.demo_link || '',
          images: [], 
          existingImages: project.images || []
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditProject = () => {
      setEditingProjectId(null);
      setNewProject({ title: '', description: '', technologies: '', link: '', demo_link: '', images: [], existingImages: [] });
  };

  const deleteProject = async (id) => {
      if (!window.confirm('Are you sure? This will delete the project and its images.')) return;
      try {
          await axios.delete(`http://localhost:5000/api/projects/${id}`, getAuthHeader());
          fetchData();
      } catch (err) {
          alert('Error deleting project');
      }
  };

  // --- Messages ---
  const [messages, setMessages] = useState([]);

  const toggleMessageRead = async (id, currentStatus) => {
      try {
          await axios.put(`http://localhost:5000/api/messages/${id}/read`, { is_read: !currentStatus }, getAuthHeader());
          // Optimistic update
          setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
      } catch (err) {
          console.error(err);
      }
  };

  const deleteMessage = async (id) => {
      if (!window.confirm("Delete this message?")) return;
      try {
          await axios.delete(`http://localhost:5000/api/messages/${id}`, getAuthHeader());
          setMessages(messages.filter(m => m.id !== id));
      } catch (err) {
          alert('Error deleting message');
      }
  };

  // --- Certificates ---
  const [certificates, setCertificates] = useState([]);
  const [newCert, setNewCert] = useState({ title: '', issuer: '', date: '', description: '', link: '' });
  const [certImage, setCertImage] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);

  const addCertificate = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      Object.keys(newCert).forEach(key => formData.append(key, newCert[key]));
      if (certImage) formData.append('image', certImage);

      try {
          if (editingCertId) {
              await axios.put(`http://localhost:5000/api/certificates/${editingCertId}`, formData, getAuthHeader());
          } else {
              await axios.post('http://localhost:5000/api/certificates', formData, getAuthHeader());
          }
          setNewCert({ title: '', issuer: '', date: '', description: '', link: '' });
          setEditingCertId(null);
          setCertImage(null);
          fetchData();
      } catch (err) {
          console.error(err);
          alert('Error saving certificate');
      }
  };

  const startEditCert = (cert) => {
      setEditingCertId(cert.id);
      setNewCert({ title: cert.title, issuer: cert.issuer, date: cert.date, description: cert.description, link: cert.link });
      setCertImage(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditCert = () => {
      setEditingCertId(null);
      setNewCert({ title: '', issuer: '', date: '', description: '', link: '' });
      setCertImage(null);
  };

  const deleteCert = async (id) => {
      if (!window.confirm('Delete this certificate?')) return;
      try {
          await axios.delete(`http://localhost:5000/api/certificates/${id}`, getAuthHeader());
          fetchData();
      } catch (err) {
          alert('Error deleting certificate');
      }
  };

  // --- Achievements ---
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({ title: '', date: '', description: '', images: [], existingImages: [] });
  const [editingAchievementId, setEditingAchievementId] = useState(null);

  const addAchievement = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newAchievement.title);
    formData.append('date', newAchievement.date);
    formData.append('description', newAchievement.description);

    if (newAchievement.images && newAchievement.images.length > 0) {
        for (let i = 0; i < newAchievement.images.length; i++) {
             formData.append('images', newAchievement.images[i]);
        }
    }

    try {
      if (editingAchievementId) {
         await axios.put(`http://localhost:5000/api/achievements/${editingAchievementId}`, formData, getAuthHeader());
      } else {
         // Check upload count? 3 max logic is implicitly handled by input or just user behavior.
         await axios.post('http://localhost:5000/api/achievements', formData, getAuthHeader());
      }
      setNewAchievement({ title: '', date: '', description: '', images: [], existingImages: [] });
      setEditingAchievementId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || 'Error saving achievement';
      alert(`Error saving achievement: ${msg}`);
    }
  };

  const startEditAchievement = (ach) => {
      setEditingAchievementId(ach.id);
      setNewAchievement({
          title: ach.title,
          date: ach.date || '',
          description: ach.description || '',
          images: [],
          existingImages: ach.images || []
      });
      // Scroll to achievements form possibly?
  };

  const cancelEditAchievement = () => {
      setEditingAchievementId(null);
      setNewAchievement({ title: '', date: '', description: '', images: [], existingImages: [] });
  };

  const deleteAchievement = async (id) => {
      if (!window.confirm("Delete this achievement?")) return;
      try {
          await axios.delete(`http://localhost:5000/api/achievements/${id}`, getAuthHeader());
          fetchData();
      } catch (err) {
          alert('Error deleting achievement');
      }
  };
  
  const moveProject = async (id, direction) => {
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return;
    
    // Create copy for manipulation
    const newItems = [...projects];
    const item = newItems[index];
    
    let targetIndex = -1;
    // Current list is rendered based on sorted state (display_order DESC)
    if (direction === 'up') targetIndex = index - 1;
    if (direction === 'down') targetIndex = index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    const targetItem = newItems[targetIndex];
    
    // Swap positions
    newItems[index] = targetItem;
    newItems[targetIndex] = item;
    
    // Recalculate orders
    const updates = newItems.map((p, idx) => ({
        id: p.id,
        display_order: newItems.length - idx
    }));
    
    try {
        await axios.put('http://localhost:5000/api/projects/reorder', { items: updates }, getAuthHeader());
        // Optimistically update
        setProjects(newItems);
        fetchData();
    } catch (err) {
        console.error(err);
        alert('Error moving project');
    }
  };

  const moveAchievement = async (id, direction) => {
    const index = achievements.findIndex(ach => ach.id === id);
    if (index === -1) return;
    
    // Create copy for manipulation
    const newItems = [...achievements];
    const item = newItems[index];
    
    let targetIndex = -1;
    // Current list is rendered based on sorted state (display_order DESC)
    if (direction === 'up') targetIndex = index - 1;
    if (direction === 'down') targetIndex = index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    const targetItem = newItems[targetIndex];
    
    // Swap positions
    newItems[index] = targetItem;
    newItems[targetIndex] = item;
    
    // Recalculate orders: Top item (index 0) gets highest order (len - idx)
    const updates = newItems.map((ach, idx) => ({
        id: ach.id,
        display_order: newItems.length - idx
    }));
    
    try {
        await axios.put('http://localhost:5000/api/achievements/reorder', { items: updates }, getAuthHeader());
        // Optimistically update
        setAchievements(newItems);
        fetchData();
    } catch (err) {
        alert('Error moving achievement');
    }
  };


  // Helper to group skills for display
  const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', padding: '100px 20px 20px' }} className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-gradient">Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'red', color: 'red' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['details', 'experience', 'skills', 'projects', 'certificates', 'messages'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'details' && (
         <form onSubmit={updateDetails} className="card">
            <h3 style={{ marginBottom: '1rem' }}>Personal Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div className="form-group"><label>Name</label><input type="text" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} /></div>
              <div className="form-group"><label>Title</label><input type="text" value={details.title} onChange={e => setDetails({...details, title: e.target.value})} /></div>
              <div className="form-group"><label>Email</label><input type="text" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} /></div>
              <div className="form-group"><label>Phone</label><input type="text" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} /></div>
              <div className="form-group"><label>Address</label><input type="text" value={details.address} onChange={e => setDetails({...details, address: e.target.value})} /></div>
              <div className="form-group"><label>LinkedIn</label><input type="text" value={details.linkedin} onChange={e => setDetails({...details, linkedin: e.target.value})} /></div>
              <div className="form-group"><label>GitHub</label><input type="text" value={details.github} onChange={e => setDetails({...details, github: e.target.value})} /></div>
              <div className="form-group"><label>Photo</label><input type="file" onChange={e => setPhoto(e.target.files[0])} /></div>
              <div className="form-group"><label>Resume/CV (PDF)</label><input type="file" onChange={e => setCv(e.target.files[0])} accept=".pdf" /></div>
              
              {/* Stats Inputs */}
              <div className="form-group"><label>Years Exp.</label><input type="text" value={details.years_experience} onChange={e => setDetails({...details, years_experience: e.target.value})} placeholder="e.g. 02+" /></div>
              <div className="form-group"><label>Projects</label><input type="text" value={details.projects_completed} onChange={e => setDetails({...details, projects_completed: e.target.value})} placeholder="e.g. 20+" /></div>
              <div className="form-group"><label>Happy Clients</label><input type="text" value={details.happy_clients} onChange={e => setDetails({...details, happy_clients: e.target.value})} placeholder="e.g. 05+" /></div>
              <div className="form-group"><label>Certifications</label><input type="text" value={details.certifications} onChange={e => setDetails({...details, certifications: e.target.value})} placeholder="e.g. 10+" /></div>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Hero Description (Short Intro)</label>
              <textarea rows="2" value={details.hero_description} onChange={e => setDetails({...details, hero_description: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid #333', padding: '10px' }}></textarea>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>About Me Description</label>
              <textarea rows="4" value={details.description} onChange={e => setDetails({...details, description: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid #333', padding: '10px' }}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Update Details</button>
         </form>
      )}

      {activeTab === 'experience' && (
          // ... (Experience remains same)
          <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>{editingExperienceId ? 'Edit Experience' : 'Add Experience'}</h3>
              <form onSubmit={addExperience} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="form-row-2-col">
                    <input placeholder="Role / Position" value={newExperience.role} onChange={e => setNewExperience({...newExperience, role: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                    <input placeholder="Company" value={newExperience.company} onChange={e => setNewExperience({...newExperience, company: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                  </div>
                  <input placeholder="Duration (e.g. 2021 - Present)" value={newExperience.duration} onChange={e => setNewExperience({...newExperience, duration: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                  <textarea placeholder="Description" rows="3" value={newExperience.description} onChange={e => setNewExperience({...newExperience, description: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} />
                  
                  <div style={{display:'flex', gap:'10px'}}>
                    <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>{editingExperienceId ? 'Update' : 'Add Experience'}</button>
                    {editingExperienceId && (
                        <button type="button" onClick={cancelEditExperience} className="btn btn-outline">Cancel</button>
                    )}
                  </div>
              </form>

              <div className="admin-list-container">
                  <ul className="admin-list">
                      {experiences.map((exp, idx) => (
                          <li key={exp.id} className="admin-list-item">
                              <div className="admin-item-info">
                                  <span className="admin-item-name">{exp.role}</span>
                                  <span style={{ fontSize: '0.85rem', color: '#aaa', marginLeft: '10px' }}>at {exp.company}</span>
                                  <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '10px' }}>({exp.duration})</span>
                              </div>
                              <div className="admin-item-actions">
                                  <button onClick={() => moveExperience(exp.id, 'up')} className="btn-icon" title="Move Up" disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1 }}>
                                      ▲
                                  </button>
                                  <button onClick={() => moveExperience(exp.id, 'down')} className="btn-icon" title="Move Down" disabled={idx === experiences.length - 1} style={{ opacity: idx === experiences.length - 1 ? 0.3 : 1 }}>
                                      ▼
                                  </button>
                                  <div style={{ width: '10px' }}></div>
                                  <button onClick={() => startEditExperience(exp)} className="btn-icon edit"><Edit2 size={16}/></button>
                                  <button onClick={() => deleteExperience(exp.id)} className="btn-icon danger"><Trash2 size={16}/></button>
                              </div>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      )}

      {/* Skills Tab & Projects Tab (omitted here for brevity in diff but assume present) */}
      {activeTab === 'skills' && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Categories Management */}
           <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Manage Categories</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  {categories.map(cat => (
                      <div key={cat.id} className="skill-tag" style={{ background: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {editCategory.id === cat.id ? (
                               <input 
                                  value={editCategory.name} 
                                  onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                                  style={{ background: '#000', border: 'none', color: 'white', width: '100px' }}
                               />
                          ) : (
                               <span>{cat.name}</span>
                          )}
                          
                          <div style={{ display: 'flex', gap: '4px' }}>
                              {editCategory.id === cat.id ? (
                                  <>
                                    <button onClick={updateCategory} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer' }}><Save size={14}/></button>
                                    <button onClick={() => setEditCategory({id: null, name: ''})} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><X size={14}/></button>
                                  </>
                              ) : (
                                  <button onClick={() => setEditCategory({id: cat.id, name: cat.name})} style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer' }}><Edit2 size={14}/></button>
                              )}
                              <button onClick={() => deleteCategory(cat.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash size={14}/></button>
                          </div>
                      </div>
                  ))}
              </div>
              
              <form onSubmit={addCategory} style={{ display: 'flex', gap: '10px' }}>
                   <input 
                        placeholder="New Category Name" 
                        value={newCategory} 
                        onChange={e => setNewCategory(e.target.value)}
                        style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} 
                        required 
                    />
                   <button type="submit" className="btn btn-outline" style={{ padding: '8px 16px' }}><Plus size={16}/> Add Category</button>
              </form>
           </div>

          {/* Skills Management */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>{editingSkillId ? 'Edit Skill' : 'Add Skill'}</h3>
            <form onSubmit={addSkill} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <select 
                  value={newSkill.category} 
                  onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                  style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }}
                  required
              >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
              </select>
              
              <input placeholder="Skill Name" value={newSkill.skill_name} onChange={e => setNewSkill({...newSkill, skill_name: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '0.8rem' }}>Icon:</span>
                <input type="file" onChange={e => setSkillIcon(e.target.files[0])} style={{ color: 'white' }} accept="image/*" />
              </div>
              <button type="submit" className="btn btn-primary">
                  {editingSkillId ? 'Update Skill' : <span><Plus size={18} /> Add Skill</span>}
              </button>
              {editingSkillId && (
                  <button type="button" onClick={cancelEditSkill} className="btn btn-outline" style={{ marginLeft: '10px' }}>
                      Cancel
                  </button>
              )}
            </form>
            
            <div className="admin-list-container">
              {Object.keys(groupedSkills).map((category) => (
                <div key={category} style={{ marginBottom: '2rem' }}>
                  <h4 style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{category}</h4>
                  <ul className="admin-list">
                    {groupedSkills[category].map(skill => (
                      <li key={skill.id} className="admin-list-item">
                        <div className="admin-item-info">
                            {skill.icon_url ? (
                                <img src={`http://localhost:5000${skill.icon_url}`} alt="icon" className="admin-item-icon"/>
                            ) : (
                                <div className="admin-item-icon" style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', color:'#aaa'}}>No Icon</div>
                            )}
                            <span className="admin-item-name">{skill.skill_name}</span>
                        </div>
                        <div className="admin-item-actions">
                            <button onClick={() => startEditSkill(skill)} className="btn-icon edit" title="Edit">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteSkill(skill.id)} className="btn-icon danger" title="Delete">
                                <Trash2 size={16} />
                            </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
         <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>{editingProjectId ? 'Edit Project' : 'Add Project'}</h3>
            <form onSubmit={addProject} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
               <input placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
               <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
               <input placeholder="Technologies (comma separated)" value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
               <input placeholder="Project Link" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} />
               <input placeholder="Demo Video Link" value={newProject.demo_link} onChange={e => setNewProject({...newProject, demo_link: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} />
               
               <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                   <label style={{fontSize:'0.9rem', color:'#aaa'}}>Project Images (Max 5) {editingProjectId && '- Uploading new images will append to existing ones'}</label>
                   <input type="file" multiple onChange={e => setNewProject({...newProject, images: Array.from(e.target.files)})} accept="image/*" />
                   {newProject.existingImages && newProject.existingImages.length > 0 && (
                       <div style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
                           {newProject.existingImages.map((img, idx) => (
                               <div key={img.id || idx} style={{width:'60px', height:'60px', borderRadius:'6px', overflow:'hidden', border: '1px solid #444', position: 'relative'}}>
                                   <img src={`http://localhost:5000${img.image_url}`} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Existing" />
                                   <button type="button" onClick={() => {}} style={{position: 'absolute', top: 0, right: 0, background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>&times;</button>
                               </div>
                           ))}
                       </div>
                   )}
               </div>

               <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>{editingProjectId ? 'Update Project' : 'Add Project'}</button>
                    {editingProjectId && (
                        <button type="button" onClick={cancelEditProject} className="btn btn-outline">Cancel</button>
                    )}
               </div>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
               {projects.map((p, idx) => (
                 <div key={p.id} className="project-card" style={{ padding: '0', height: 'auto', display: 'flex', flexDirection: 'column', background: '#1e1e1e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' }}>
                    <div style={{height: '160px', overflow: 'hidden', background: '#000', position: 'relative'}}>
                        {p.images && p.images.length > 0 ? (
                            <img src={`http://localhost:5000${p.images[0].image_url}`} alt={p.title} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                        ) : (
                             <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color: '#555'}}><Layers /></div>
                        )}
                        <div style={{position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#fff'}}>
                            {p.images ? p.images.length : 0} Images
                        </div>
                   </div>
                    
                    {/* Reorder Controls */}
                    <div style={{ padding: '10px', background: '#252525', display: 'flex', justifyContent: 'center', gap: '10px', borderBottom: '1px solid #333' }}>
                         <button onClick={() => moveProject(p.id, 'up')} className="btn-icon" title="Move Up" disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1, background: '#333', borderRadius: '4px', padding: '4px' }}>
                             ▲
                         </button>
                         <button onClick={() => moveProject(p.id, 'down')} className="btn-icon" title="Move Down" disabled={idx === projects.length - 1} style={{ opacity: idx === projects.length - 1 ? 0.3 : 1, background: '#333', borderRadius: '4px', padding: '4px' }}>
                             ▼
                         </button>
                    </div>
                    
                    <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{p.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '0 0 1rem 0', flex: 1 }}>{p.description}</p>
                        
                        <div style={{display:'flex', gap:'5px', flexWrap:'wrap', marginBottom: '1.5rem'}}>
                            {p.technologies && p.technologies.split(',').map((t,i) => (
                                <span key={i} style={{fontSize:'0.7rem', background:'#2a2a2a', padding:'3px 8px', borderRadius:'4px', color: '#ccc'}}>{t.trim()}</span>
                            ))}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                            <button onClick={() => startEditProject(p)} className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', borderColor: '#444', color: '#ccc' }}>
                                <Edit2 size={16}/> Edit
                            </button>
                            <button onClick={() => deleteProject(p.id)} className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', borderColor: 'rgba(239, 68, 68, 0.5)', color: '#ef4444' }}>
                                <Trash2 size={16}/> Delete
                            </button>
                        </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      )}

      {activeTab === 'certificates' && (
          <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>{editingCertId ? 'Edit Certificate' : 'Add Certificate'}</h3>
              <form onSubmit={addCertificate} style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="form-row-2-col">
                      <input placeholder="Title / Achievement" value={newCert.title} onChange={e => setNewCert({...newCert, title: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                      <input placeholder="Issuer (e.g. Google, Coursera)" value={newCert.issuer} onChange={e => setNewCert({...newCert, issuer: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} />
                  </div>
                  <div className="form-row-2-col">
                      <input placeholder="Date (e.g. March 2024)" value={newCert.date} onChange={e => setNewCert({...newCert, date: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} />
                      <input placeholder="Credential Link" value={newCert.link} onChange={e => setNewCert({...newCert, link: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} />
                  </div>
                  <textarea placeholder="Description" rows="3" value={newCert.description} onChange={e => setNewCert({...newCert, description: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Certificate Image (Optional)</label>
                      <input type="file" onChange={e => setCertImage(e.target.files[0])} accept="image/*" />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>{editingCertId ? 'Update' : 'Add Certificate'}</button>
                    {editingCertId && (
                        <button type="button" onClick={cancelEditCert} className="btn btn-outline">Cancel</button>
                    )}
                      </div>
              </form>

              <div className="admin-list-container">
                  <ul className="admin-list">
                      {certificates.map((cert, idx) => (
                          <li key={cert.id} className="admin-list-item">
                              <div className="admin-item-info">
                                  {cert.image_url && <img src={`http://localhost:5000${cert.image_url}`} style={{ width:'40px', height:'40px', borderRadius:'4px', marginRight:'10px', objectFit:'cover' }} />}
                                  <div>
                                      <span className="admin-item-name">{cert.title}</span>
                                      <span style={{ fontSize: '0.8rem', color: '#888', display:'block' }}>{cert.issuer} • {cert.date}</span>
                                  </div>
                              </div>
                              <div className="admin-item-actions">
                                  <button onClick={() => moveCertificate(cert.id, 'up')} className="btn-icon" title="Move Up" disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1 }}>
                                      ▲
                                  </button>
                                  <button onClick={() => moveCertificate(cert.id, 'down')} className="btn-icon" title="Move Down" disabled={idx === certificates.length - 1} style={{ opacity: idx === certificates.length - 1 ? 0.3 : 1 }}>
                                      ▼
                                  </button>
                                  <div style={{ width: '10px' }}></div>
                                  <button onClick={() => startEditCert(cert)} className="btn-icon edit"><Edit2 size={16}/></button>
                                  <button onClick={() => deleteCert(cert.id)} className="btn-icon danger"><Trash2 size={16}/></button>
                              </div>
                          </li>
                      ))}
                  </ul>
              </div>
              
              {/* --- Achievements Section --- */}
              <h3 style={{ margin: '2rem 0 1rem 0', borderTop: '1px solid #333', paddingTop: '1rem', color: '#fbbf24' }}>Achievements</h3>
              
              <div style={{ marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '1rem' }}>{editingAchievementId ? 'Edit Achievement' : 'Add Achievement'}</h4>
                  <form onSubmit={addAchievement} style={{ display: 'grid', gap: '1rem' }}>
                      <div className="form-row-2-col">
                          <input placeholder="Title" value={newAchievement.title} onChange={e => setNewAchievement({...newAchievement, title: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} required />
                          <input placeholder="Date (e.g. 2024)" value={newAchievement.date} onChange={e => setNewAchievement({...newAchievement, date: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} />
                      </div>
                      <textarea placeholder="Description" rows="3" value={newAchievement.description} onChange={e => setNewAchievement({...newAchievement, description: e.target.value})} style={{ padding: '8px', background: '#222', border: '1px solid #444', color: 'white' }} />
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Achievement Images (Max 3) {editingAchievementId && '- Uploading new appends to existing'}</label>
                          <input type="file" multiple onChange={e => setNewAchievement({...newAchievement, images: Array.from(e.target.files)})} accept="image/*" />
                          
                          {newAchievement.existingImages && newAchievement.existingImages.length > 0 && (
                               <div style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
                                   {newAchievement.existingImages.map((img, idx) => (
                                       <div key={img.id || idx} style={{width:'60px', height:'60px', borderRadius:'6px', overflow:'hidden', border: '1px solid #444', position: 'relative'}}>
                                           <img src={`http://localhost:5000${img.image_url}`} style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Existing" />
                                           <button type="button" onClick={() => {/* Delete Logic if needed */}} style={{position: 'absolute', top: 0, right: 0, background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize:'12px'}}>&times;</button>
                                       </div>
                                   ))}
                               </div>
                           )}
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>{editingAchievementId ? 'Update' : 'Add Achievement'}</button>
                        {editingAchievementId && (
                            <button type="button" onClick={cancelEditAchievement} className="btn btn-outline">Cancel</button>
                        )}
                      </div>
                  </form>
              </div>

             <div className="admin-list-container">
                  <ul className="admin-list">
                      {achievements.map((ach, idx) => (
                          <li key={ach.id} className="admin-list-item">
                              <div className="admin-item-info">
                                  {ach.images && ach.images.length > 0 ? (
                                     <div style={{display:'flex', marginRight:'10px'}}> 
                                       <img src={`http://localhost:5000${ach.images[0].image_url}`} style={{ width:'40px', height:'40px', borderRadius:'4px', objectFit:'cover' }} />
                                       {ach.images.length > 1 && <span style={{fontSize:'0.7rem', alignSelf:'flex-end', marginLeft:'2px'}}>+{ach.images.length -1}</span>}
                                     </div>
                                  ) : (
                                     <div style={{width:'40px', height:'40px', background:'#333', marginRight:'10px', borderRadius:'4px'}}></div>
                                  )}
                                  <div>
                                      <span className="admin-item-name">{ach.title}</span>
                                      <span style={{ fontSize: '0.8rem', color: '#888', display:'block' }}>{ach.date}</span>
                                  </div>
                              </div>
                              <div className="admin-item-actions">
                                  <button onClick={() => moveAchievement(ach.id, 'up')} className="btn-icon" title="Move Up" disabled={idx === 0} style={{ opacity: idx === 0 ? 0.3 : 1 }}>
                                      ▲
                                  </button>
                                  <button onClick={() => moveAchievement(ach.id, 'down')} className="btn-icon" title="Move Down" disabled={idx === achievements.length - 1} style={{ opacity: idx === achievements.length - 1 ? 0.3 : 1 }}>
                                      ▼
                                  </button>
                                  <div style={{ width: '10px' }}></div>
                                  <button onClick={() => startEditAchievement(ach)} className="btn-icon edit"><Edit2 size={16}/></button>
                                  <button onClick={() => deleteAchievement(ach.id)} className="btn-icon danger"><Trash2 size={16}/></button>
                              </div>
                          </li>
                      ))}
                  </ul>
              </div>

          </div>
      )}

      {activeTab === 'messages' && (
        <div className="card">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                 <h3 style={{ margin: 0 }}>Messages</h3>
                 <div style={{display:'flex', gap:'1rem'}}>
                     <span style={{ fontSize: '0.9rem', color: '#fde047' }}>
                         Unread: {messages.filter(m => !m.is_read).length}
                     </span>
                     <span style={{ fontSize: '0.9rem', color: '#aaa' }}>
                         Total: {messages.length}
                     </span>
                 </div>
             </div>

             <div className="admin-list-container">
                 {messages.length === 0 ? (
                     <p style={{textAlign:'center', color:'#666', padding:'2rem'}}>No messages yet.</p>
                 ) : (
                     <ul className="admin-list">
                         {messages.map(msg => (
                             <li key={msg.id} className="admin-list-item" style={{ 
                                 flexDirection: 'column', 
                                 alignItems: 'flex-start', 
                                 background: msg.is_read ? '#1a1a1a' : '#2a2a2a',
                                 borderLeft: msg.is_read ? '2px solid transparent' : '2px solid #fbbf24'
                             }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
                                     <div>
                                         <h4 style={{ margin: 0, color: msg.is_read ? '#ccc' : 'white', fontSize: '1.1rem' }}>{msg.name}</h4>
                                         <span style={{ fontSize: '0.85rem', color: '#fde047' }}>{msg.title}</span>
                                     </div>
                                     <span style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(msg.created_at).toLocaleDateString()}</span>
                                 </div>
                                 
                                 <div style={{ display: 'flex', gap: '1rem', color: '#888', fontSize: '0.9rem', marginBottom: '1rem', flexWrap:'wrap' }}>
                                     <span>✉️ {msg.email}</span>
                                     <span>📞 {msg.phone}</span>
                                     {msg.address && <span>📍 {msg.address}</span>}
                                 </div>

                                 <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', width: '100%', color: '#ddd', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                     {msg.message}
                                 </div>

                                 <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', width: '100%', justifyContent: 'flex-end' }}>
                                     <button 
                                         onClick={() => toggleMessageRead(msg.id, msg.is_read)} 
                                         className="btn btn-outline" 
                                         style={{ 
                                             fontSize: '0.8rem', 
                                             borderColor: msg.is_read ? '#444' : '#fbbf24', 
                                             color: msg.is_read ? '#aaa' : '#fbbf24' 
                                         }}
                                     >
                                         {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                                     </button>
                                     <button 
                                         onClick={() => deleteMessage(msg.id)} 
                                         className="btn-icon danger" 
                                         title="Delete Message"
                                         style={{ width: '30px', height: '30px' }}
                                     >
                                         <Trash2 size={16} />
                                     </button>
                                 </div>
                             </li>
                         ))}
                     </ul>
                 )}
             </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
