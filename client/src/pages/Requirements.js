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

  if (!project) return <div style={{padding:40, color: '#f8fafc', background: '#0f172a', height: '100vh'}}>Loading Data...</div>;

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
    { name: 'Pending', value: pendingCount, color: '#f5a524' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="module-wrapper">
      <style>{`
        .module-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
          color: #f8fafc;
          font-family: var(--font-sans);
          padding: clamp(20px, 4vw, 40px);
          overflow-x: hidden;
        }

        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 40px;
        }

        .page-title {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 5px 0;
        }

        .page-sub { color: #94a3b8; margin: 0; font-size: 14px; }

        .tab-container {
          background: rgba(30, 41, 59, 0.5);
          padding: 6px;
          border-radius: 12px;
          display: flex;
          gap: 5px;
          border: 1px solid #334155;
          flex-wrap: wrap;
        }

        .tab-btn {
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #94a3b8;
          background: transparent;
          transition: 0.2s;
        }
        .tab-btn.active {
          background: #1e293b;
          color: #f8fafc;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.05);
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
           background: #1e293b;
           border: 1px solid #334155;
           padding: 20px;
           border-radius: 16px;
           display: flex;
           flex-direction: column;
           gap: 10px;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 25px;
        }
        @media (min-width: 1024px) {
          .main-grid { grid-template-columns: 2fr 1fr; }
        }

        .panel-box {
          background: #1e293b;
          border: 1px solid #334155;
          padding: clamp(15px, 2vw, 25px);
          border-radius: 20px;
        }
        
        .panel-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 20px;
           flex-wrap: wrap;
           gap: 10px;
        }

        .panel-title { margin: 0; font-size: 16px; color: #e2e8f0; font-weight: 700; }

        .add-form {
          display: flex;
          gap: 10px;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 5px;
          flex: 1;
          max-width: 300px;
        }

        .add-input {
          background: transparent;
          border: none;
          padding: 8px 12px;
          outline: none;
          font-size: 13px;
          color: #f8fafc;
          flex: 1;
        }
        
        .add-btn {
          background: #38bdf8;
          color: #0f172a;
          border: none;
          border-radius: 8px;
          width: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .req-list { display: flex; flexDirection: column; gap: 12px; }

        .req-card {
           background: rgba(15, 23, 42, 0.4);
           padding: 15px;
           border-radius: 12px;
           display: flex;
           justify-content: space-between;
           align-items: center;
           border-top: 1px solid rgba(255, 255, 255, 0.05);
           border-right: 1px solid rgba(255, 255, 255, 0.05);
           border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .req-text { font-size: 14px; font-weight: 600; }
        .req-status { font-size: 10px; font-weight: 800; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.5px; }

        .action-btn {
           background: transparent;
           border: 1px solid #334155;
           cursor: pointer;
           padding: 8px;
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: 0.2s;
        }
        .action-btn:hover { background: #334155; }
        
        .summary-box {
          margin-top: 20px;
          padding: 20px;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
      
      {/* HEADER */}
      <div className="top-header">
        <div>
          <h1 className="page-title">Requirements Spec</h1>
          <p className="page-sub">{project.name} • Scope Definition</p>
        </div>
        
        {/* TABS */}
        <div className="tab-container">
           <button 
             onClick={() => setActiveTab('user')} 
             className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
           >
             <Users size={16} color={activeTab === 'user' ? '#38bdf8' : '#64748b'}/> <span>USER STORIES</span>
           </button>
           <button 
             onClick={() => setActiveTab('system')} 
             className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
           >
             <Server size={16} color={activeTab === 'system' ? '#a855f7' : '#64748b'}/> <span>SYSTEM SPECS</span>
           </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="metrics-grid">
        <MetricCard title="Total Requirements" value={currentList.length} trend="Total" icon={FileText} color="#6366f1" />
        <MetricCard title="Approved" value={approvedCount} trend="Ready" icon={Check} color="#10b981" />
        <MetricCard title="Pending Review" value={pendingCount} trend="In Queue" icon={Box} color="#f5a524" />
        <MetricCard title="Security Checks" value="Pass" trend="Safe" icon={Shield} color="#38bdf8" />
      </div>

      {/* MAIN CONTENT */}
      <div className="main-grid">
        
        {/* LIST SECTION */}
        <div className="panel-box">
          <div className="panel-header">
             <h3 className="panel-title">{activeTab === 'user' ? 'User Needs Overview' : 'Technical Specifications View'}</h3>
             <form onSubmit={addRequirement} className="add-form">
                <input 
                  placeholder="New requirement..." 
                  value={newReq} 
                  onChange={e => setNewReq(e.target.value)}
                  className="add-input"
                />
                <button type="submit" className="add-btn"><Plus size={16}/></button>
             </form>
          </div>

          <div className="req-list">
            {currentList.length === 0 ? (
               <div style={{textAlign:'center', padding:'40px', color:'#64748b'}}>No requirements assigned.</div>
            ) : (
               <AnimatePresence>
                 {currentList.map(item => (
                   <motion.div 
                     key={item.id}
                     layout
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="req-card"
                     style={{
                       borderLeft: `4px solid ${item.status === 'approved' ? '#10b981' : item.status === 'rejected' ? '#ef4444' : '#f5a524'}`
                     }}
                   >
                     <div style={{flex:1}}>
                       <div className="req-text" style={{color: item.status === 'rejected' ? '#64748b' : '#e2e8f0', textDecoration: item.status === 'rejected' ? 'line-through' : 'none'}}>
                         {item.text}
                       </div>
                       <div className="req-status" style={{color: item.status === 'approved' ? '#10b981' : item.status === 'rejected' ? '#ef4444' : '#f5a524'}}>
                         {item.status}
                       </div>
                     </div>
                     <div style={{display:'flex', gap:'8px', marginLeft:'15px'}}>
                        {item.status !== 'approved' && (
                          <button onClick={() => updateStatus(item.id, 'approved')} className="action-btn" title="Approve">
                            <Check size={16} color="#10b981"/>
                          </button>
                        )}
                        {item.status !== 'rejected' && (
                          <button onClick={() => updateStatus(item.id, 'rejected')} className="action-btn" title="Reject">
                            <X size={16} color="#ef4444"/>
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
        <div className="panel-box">
          <h3 className="panel-title">Approval Status Matrix</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{fontSize:12, fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <YAxis hide />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff'}}/>
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="summary-box">
             <p style={{margin:0, fontSize:'13px', color:'#94a3b8', fontWeight:'600'}}>
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
  <div className="metric-card">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
      <div>
        <div style={{color:'#94a3b8', fontSize:'13px', fontWeight:'600'}}>{title}</div>
        <div style={{fontSize:'28px', fontWeight:'900', color:'#f8fafc', marginTop:'5px'}}>{value}</div>
      </div>
      <div style={{background:`${color}20`, padding:'12px', borderRadius:'12px'}}><Icon size={22} color={color} /></div>
    </div>
    <div style={{marginTop:'auto', paddingTop:'15px'}}>
      <div style={{fontSize:'12px', color:color, background:`${color}15`, display:'inline-block', padding:'4px 10px', borderRadius:'20px', fontWeight:'700'}}>{trend}</div>
    </div>
  </div>
);

export default Requirements;