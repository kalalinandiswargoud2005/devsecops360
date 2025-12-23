import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, List, GitBranch, Server, Database, Layout, Save } from 'lucide-react';

function Planning({ projects, updateProject }) {
  const { id } = useParams();
  const project = projects.find(p => p.id === Number(id));
  
  // Local state to handle editing before saving
  const [formData, setFormData] = useState(project ? project.planning : {});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    updateProject(id, 'planning', formData);
    alert("Planning Data Saved Successfully!");
  };

  if (!project) return <div>Project not found</div>;

  const steps = [
    { key: 'problem', title: '1. Problem & Goals', icon: Target, placeholder: "What problem are we solving?" },
    { key: 'requirements', title: '2. Requirements & Features', icon: List, placeholder: "List functional and non-functional requirements..." },
    { key: 'workflow', title: '3. App Workflow', icon: GitBranch, placeholder: "Describe the user flow (e.g., Login -> Home -> Action)..." },
    { key: 'architecture', title: '4. System Architecture', icon: Server, placeholder: "Monolith or Microservices? Tech Stack?" },
    { key: 'database', title: '5. Database Design', icon: Database, placeholder: "Schema design, SQL vs NoSQL..." },
    { key: 'uiux', title: '6. UI/UX Wireframes', icon: Layout, placeholder: "Describe layouts, color palette, and user experience..." },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Planning Phase: {project.name}</h1>
          <p style={styles.subtitle}>Define the core blueprint of the application.</p>
        </div>
        <button onClick={handleSave} style={styles.saveBtn}>
          <Save size={18} /> Save Blueprint
        </button>
      </div>

      {/* 6-STEP GRID */}
      <div style={styles.grid}>
        {steps.map((step, index) => (
          <motion.div 
            key={step.key}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            style={styles.card}
          >
            <div style={styles.cardHeader}>
              <step.icon size={20} color="#2563eb" />
              <span style={styles.cardTitle}>{step.title}</span>
            </div>
            <textarea 
              style={styles.textarea} 
              placeholder={step.placeholder}
              value={formData[step.key] || ""}
              onChange={(e) => handleChange(step.key, e.target.value)}
            />
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}

const styles = {
  container: { padding: '40px', overflowY: 'auto', height: '100vh', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b' },
  saveBtn: {
    background: '#10b981', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', paddingBottom: '50px' },
  card: {
    background: 'white', borderRadius: '16px', padding: '25px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' },
  cardTitle: { fontWeight: '700', color: '#334155', fontSize: '15px' },
  textarea: {
    width: '100%', height: '120px', padding: '15px', borderRadius: '12px',
    border: '1px solid #e2e8f0', background: '#f8fafc',
    fontSize: '14px', color: '#475569', resize: 'vertical', outline: 'none',
    fontFamily: 'inherit'
  }
};

export default Planning;