import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Settings, Zap, FileText, Save, CheckCircle } from 'lucide-react';

function Requirements({ projects, updateProject }) {
  const { id } = useParams();
  const project = projects.find(p => p.id === Number(id));
  
  // Local state for editing
  const [formData, setFormData] = useState(project ? project.requirements : {});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    updateProject(id, 'requirements', formData);
    alert("Requirements Specification Saved!");
  };

  if (!project) return <div style={{padding:40}}>Project loading...</div>;

  // Configuration for the 4 Sections
  const sections = [
    { 
      key: 'userNeeds', 
      title: '1. Gather User Needs', 
      icon: Users, 
      color: '#3b82f6', // Blue
      placeholder: "Who are the users? What are their pain points? (e.g., 'As a user, I want to...')" 
    },
    { 
      key: 'functional', 
      title: '2. Functional Requirements', 
      icon: Settings, 
      color: '#8b5cf6', // Purple
      placeholder: "What must the system DO? (e.g., 'System shall send email on signup')" 
    },
    { 
      key: 'nonFunctional', 
      title: '3. Non-Functional Requirements', 
      icon: Zap, 
      color: '#f59e0b', // Amber
      placeholder: "Performance, Security, Scalability constraints? (e.g., 'Load < 1s')" 
    },
    { 
      key: 'documentation', 
      title: '4. Documentation & Clarity', 
      icon: FileText, 
      color: '#10b981', // Emerald
      placeholder: "Link to SRS document, legal approvals, or summary notes..." 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      style={styles.container}
    >
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Requirements Analysis</h1>
          <p style={styles.subtitle}>Define what the application should do (Functional & Non-Functional).</p>
        </div>
        <button onClick={handleSave} style={styles.saveBtn}>
          <Save size={18} /> Save Specs
        </button>
      </div>

      {/* SUMMARY BANNER */}
      <div style={styles.banner}>
        <CheckCircle size={24} color="#059669" />
        <div>
          <strong>Objective:</strong> Ensure all stakeholder needs are captured before coding begins.
        </div>
      </div>

      {/* 4-SECTION GRID */}
      <div style={styles.grid}>
        {sections.map((section, index) => (
          <motion.div 
            key={section.key}
            style={styles.card}
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div style={styles.cardHeader}>
              <div style={{...styles.iconBox, background: `${section.color}20`}}>
                <section.icon size={22} color={section.color} />
              </div>
              <h3 style={styles.cardTitle}>{section.title}</h3>
            </div>
            
            <textarea 
              style={styles.textarea} 
              placeholder={section.placeholder}
              value={formData[section.key] || ""}
              onChange={(e) => handleChange(section.key, e.target.value)}
            />
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: '1400px', margin: '0 auto', height: '100vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '5px' },
  saveBtn: {
    background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px',
    borderRadius: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
  },
  banner: {
    background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '20px',
    display: 'flex', alignItems: 'center', gap: '15px', color: '#065f46', marginBottom: '40px'
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '30px', paddingBottom: '50px' },
  card: {
    background: 'white', borderRadius: '20px', padding: '30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9',
    display: 'flex', flexDirection: 'column'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  iconBox: { padding: '12px', borderRadius: '12px' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#334155', margin: 0 },
  textarea: {
    width: '100%', height: '200px', padding: '20px', borderRadius: '12px',
    border: '1px solid #e2e8f0', background: '#f8fafc',
    fontSize: '15px', lineHeight: '1.6', color: '#475569', resize: 'none', outline: 'none',
    fontFamily: 'inherit', flex: 1
  }
};

export default Requirements;