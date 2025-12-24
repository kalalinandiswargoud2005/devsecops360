import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Plus, Check, X, Shield, Users, Server, Box 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Requirements({ projects, updateProject }) {
  const { id } = useParams();
  const project = projects.find(p => p.id === Number(id));
  const userNeeds = project?.requirements?.userNeeds || [];
  const systemReqs = project?.requirements?.systemReqs || [];
  
  const [activeTab, setActiveTab] = useState('user');
  const [newReq, setNewReq] = useState("");

  if (!project) return <div style={{padding:40}}>Loading...</div>;

  const addRequirement = (e) => {
    e.preventDefault();
    if (!newReq.trim()) return;
    const reqItem = { id: Date.now(), text: newReq, status: 'pending' };
    const updatedData = { ...project.requirements };
    if (activeTab === 'user') updatedData.userNeeds = [...userNeeds, reqItem];
    else updatedData.systemReqs = [...systemReqs, reqItem];
    updateProject(project.id, 'requirements', updatedData);
    setNewReq("");
  };

  const updateStatus = (reqId, newStatus) => {
    const list = activeTab === 'user' ? userNeeds : systemReqs;
    const updatedList = list.map(item => item.id === reqId ? { ...item, status: newStatus } : item);
    const updatedData = { ...project.requirements };
    if (activeTab === 'user') updatedData.userNeeds = updatedList;
    else updatedData.systemReqs = updatedList;
    updateProject(project.id, 'requirements', updatedData);
  };

  const currentList = activeTab === 'user' ? userNeeds : systemReqs;

  // Chart Data
  const pendingCount = currentList.filter(i => i.status === 'pending').length;
  const approvedCount = currentList.filter(i => i.status === 'approved').length;
  const rejectedCount = currentList.filter(i => i.status === 'rejected').length;

  const chartData = [
    { name: 'Approved', value: approvedCount, color: '#10b981' },
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.topSection}>
        <div>
          <h1 style={styles.title}>Requirements Spec</h1>
          <p style={styles.subtitle}>{project.name} • Scope Definition</p>
        </div>
        
        {/* TABS */}
        <div style={styles.tabContainer}>
           <button 
             onClick={() => setActiveTab('user')} 
             style={{...styles.tabBtn, background: activeTab === 'user' ? '#fff' : 'transparent', boxShadow: activeTab === 'user' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none'}}
           >
             <Users size={16} color={activeTab === 'user' ? '#3b82f6' : '#64748b'}/> <span>User Stories</span>
           </button>
           <button 
             onClick={() => setActiveTab('system')} 
             style={{...styles.tabBtn, background: activeTab === 'system' ? '#fff' : 'transparent', boxShadow: activeTab === 'system' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none'}}
           >
             <Server size={16} color={activeTab === 'system' ? '#a855f7' : '#64748b'}/> <span>System Specs</span>
           </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={styles.metricsGrid}>
        <MetricCard title="Total Requirements" value={currentList.length} trend="Total" icon={FileText} color="#6366f1" />
        <MetricCard title="Approved" value={approvedCount} trend="Ready" icon={Check} color="#10b981" />
        <MetricCard title="Pending Review" value={pendingCount} trend="In Queue" icon={Box} color="#f59e0b" />
        <MetricCard title="Security Checks" value="Pass" trend="Safe" icon={Shield} color="#3b82f6" />
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.contentGrid}>
        
        {/* LIST SECTION */}
        <div style={styles.listSection}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
             <h3 style={styles.sectionTitle}>{activeTab === 'user' ? 'User Needs' : 'Technical Specifications'}</h3>
             <form onSubmit={addRequirement} style={styles.miniForm}>
                <input 
                  placeholder="New requirement..." 
                  value={newReq} 
                  onChange={e => setNewReq(e.target.value)}
                  style={styles.miniInput}
                />
                <button type="submit" style={styles.miniBtn}><Plus size={16}/></button>
             </form>
          </div>

          <div style={styles.reqList}>
            {currentList.length === 0 ? (
               <div style={styles.emptyState}>No requirements added yet.</div>
            ) : (
               <AnimatePresence>
                 {currentList.map(item => (
                   <motion.div 
                     key={item.id}
                     layout
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     style={{
                       ...styles.reqCard,
                       borderLeft: `4px solid ${item.status === 'approved' ? '#10b981' : item.status === 'rejected' ? '#ef4444' : '#f59e0b'}`
                     }}
                   >
                     <div style={{flex:1}}>
                       <div style={{fontSize:'14px', color: item.status === 'rejected' ? '#94a3b8' : '#334155', textDecoration: item.status === 'rejected' ? 'line-through' : 'none'}}>
                         {item.text}
                       </div>
                       <div style={{fontSize:'10px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', marginTop:'4px'}}>
                         {item.status}
                       </div>
                     </div>
                     <div style={{display:'flex', gap:'5px'}}>
                        {item.status !== 'approved' && (
                          <button onClick={() => updateStatus(item.id, 'approved')} style={styles.actionBtn} title="Approve">
                            <Check size={14} color="#10b981"/>
                          </button>
                        )}
                        {item.status !== 'rejected' && (
                          <button onClick={() => updateStatus(item.id, 'rejected')} style={styles.actionBtn} title="Reject">
                            <X size={14} color="#ef4444"/>
                          </button>
                        )}
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
            )}
          </div>
        </div>

        {/* CHART SECTION */}
        <div style={styles.chartSection}>
          <h3 style={styles.sectionTitle}>Approval Status</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{fontSize:12, fill:'#64748b'}} axisLine={false} tickLine={false}/>
                <YAxis hide />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.summaryBox}>
             <p style={{textAlign:'center', fontSize:'13px', color:'#64748b'}}>
               Overview of requirements status for the {activeTab === 'user' ? 'User' : 'System'} module.
             </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// Reusable Metric Component
const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
  <div style={styles.metricCard}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
      <div>
        <div style={{color:'#64748b', fontSize:'13px', fontWeight:'600'}}>{title}</div>
        <div style={{fontSize:'24px', fontWeight:'800', color:'#1e293b', marginTop:'5px'}}>{value}</div>
      </div>
      <div style={{background:`${color}20`, padding:'10px', borderRadius:'10px'}}><Icon size={20} color={color} /></div>
    </div>
    <div style={{marginTop:'10px', fontSize:'12px', color:color, background:`${color}10`, display:'inline-block', padding:'4px 8px', borderRadius:'6px', fontWeight:'600'}}>{trend}</div>
  </div>
);

const styles = {
  container: { padding: '40px', height: '100vh', overflowY: 'auto', boxSizing: 'border-box', background: '#f8fafc' },
  topSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '5px' },

  tabContainer: { background: '#e2e8f0', padding: '4px', borderRadius: '12px', display: 'flex', gap: '5px' },
  tabBtn: { border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color:'#334155', transition: '0.2s' },

  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', marginBottom: '30px' },
  metricCard: { background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },

  contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' },
  listSection: { background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  chartSection: { background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  
  sectionTitle: { margin: '0', fontSize: '16px', color: '#334155', fontWeight: '700' },
  
  miniForm: { display:'flex', gap:'10px' },
  miniInput: { background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'6px 12px', outline:'none', fontSize:'13px' },
  miniBtn: { background:'#3b82f6', color:'white', border:'none', borderRadius:'8px', width:'32px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },

  reqList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  reqCard: { background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  actionBtn: { background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer', padding: '6px', borderRadius: '6px', boxShadow:'0 2px 4px rgba(0,0,0,0.05)' },
  emptyState: { textAlign:'center', padding:'40px', color:'#94a3b8', fontSize:'14px' },
  summaryBox: { marginTop:'20px', padding:'15px', background:'#f8fafc', borderRadius:'12px' }
};

export default Requirements;