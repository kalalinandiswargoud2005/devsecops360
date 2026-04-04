import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Activity, Plus, Trash2, ToggleLeft, ToggleRight, Search, Settings, Lock, Server } from 'lucide-react';

function Admin({ usersDB, setUsersDB }) {
  const [activeTab, setActiveTab ] = useState('team'); 
  const [newUser, setNewUser] = useState({ username: '', password: '123', role: 'Developer' });
  
  const [logs] = useState([
    { id: 1, action: 'User Login', user: 'admin', time: '10:42 AM', ip: '192.168.1.4' },
    { id: 2, action: 'Project Created', user: 'manager', time: '09:15 AM', ip: '192.168.1.12' },
    { id: 3, action: 'Security Scan', user: 'system', time: '02:00 AM', ip: 'localhost' },
    { id: 4, action: 'User Deleted', user: 'admin', time: 'Yesterday', ip: '192.168.1.4' },
  ]);

  const addUser = (e) => {
    e.preventDefault();
    if (!newUser.username) return;
    setUsersDB([...usersDB, { ...newUser, id: Date.now() }]);
    setNewUser({ username: '', password: '123', role: 'Developer' });
  };

  const removeUser = (userId) => {
    if (window.confirm(`Are you sure you want to remove this user?`)) {
      setUsersDB(usersDB.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper {
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
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 40px;
        }

        .page-title {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 5px 0;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .page-sub { color: #94a3b8; margin: 0; font-size: 14px; }

        .admin-badge {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          border: 1px solid rgba(239, 68, 68, 0.2);
          letter-spacing: 0.5px;
        }

        .tabs-nav {
          display: flex;
          gap: 10px;
          margin-bottom: 40px;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          padding: 8px;
          border-radius: 16px;
          width: fit-content;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          background: transparent;
          color: #64748b;
          transition: 0.3s;
        }
        .tab-btn.active { background: #38bdf8; color: #020617; box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3); }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
        }
        @media (min-width: 1024px) {
          .main-grid { grid-template-columns: 1.5fr 1fr; }
        }

        .admin-card {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 30px;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .card-header { margin: 0 0 25px 0; font-size: 18px; color: #f8fafc; font-weight: 800; display: flex; align-items: center; gap: 10px; }

        .user-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .user-avatar {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 18px;
        }

        .user-name { font-weight: 700; color: #f1f5f9; font-size: 15px; }
        .user-role { font-size: 12px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }

        .del-btn { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; padding: 10px; border-radius: 10px; cursor: pointer; transition: 0.2s; }
        .del-btn:hover { background: #ef4444; color: white; }

        .st-input {
          width: 100%;
          background: #0f172a;
          border: 1px solid #334155;
          padding: 12px 15px;
          border-radius: 12px;
          color: white;
          outline: none;
          margin-bottom: 20px;
          font-family: inherit;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transition: 0.2s;
        }
        .submit-btn:hover { background: #059669; transform: translateY(-2px); }

        .st-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .audit-table { width: 100%; border-collapse: collapse; }
        .audit-table th { padding: 15px; text-align: left; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .audit-table td { padding: 18px 15px; font-size: 14px; border-top: 1px solid rgba(255,255,255,0.03); }

      `}</style>
      
      {/* HEADER */}
      <div className="top-header">
        <div>
          <h1 className="page-title"><Shield size={32} color="#38bdf8"/> System Administration</h1>
          <p className="page-sub">Global Control Center • Audit Trails & Identity Management</p>
        </div>
        <div className="admin-badge">PRIVILEGED ACCESS: ROOT</div>
      </div>

      {/* TABS */}
      <div className="tabs-nav">
        <button onClick={() => setActiveTab('team')} className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}>
          <Users size={18} /> IDENTITY
        </button>
        <button onClick={() => setActiveTab('settings')} className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}>
          <Settings size={18} /> SYSTEM CONFIG
        </button>
        <button onClick={() => setActiveTab('logs')} className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}>
          <Activity size={18} /> AUDIT TRAIL
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        <AnimatePresence mode='wait'>
          
          {activeTab === 'team' && (
            <motion.div 
              key="team"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              className="main-grid"
            >
              {/* User List */}
              <div className="admin-card">
                <h3 className="card-header"><Users size={20} color="#38bdf8"/> ACTIVE DIRECTORY ({usersDB.length})</h3>
                <div className="user-list">
                  {usersDB.map((u) => (
                    <div key={u.id} className="user-row">
                      <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                        <div className="user-avatar">{u.username?.charAt(0).toUpperCase() || '?'}</div>
                        <div>
                          <div className="user-name">{u.username}</div>
                          <div className="user-role">{u.role}</div>
                        </div>
                      </div>
                      {u.username !== 'admin' && (
                        <button onClick={() => removeUser(u.id)} className="del-btn" title="Revoke Access">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add User Form */}
              <div className="admin-card">
                <h3 className="card-header"><Plus size={20} color="#10b981"/> PROVISION NEW ENTITY</h3>
                <form onSubmit={addUser}>
                  <div style={{marginBottom:15}}>
                    <label style={{fontSize:11, fontWeight:800, color:'#475569', marginBottom:8, display:'block'}}>IDENTIFIER</label>
                    <input 
                      className="st-input"
                      value={newUser.username}
                      onChange={e => setNewUser({...newUser, username: e.target.value})}
                      placeholder="e.g. jdoe_secops"
                    />
                  </div>
                  <div style={{marginBottom:15}}>
                    <label style={{fontSize:11, fontWeight:800, color:'#475569', marginBottom:8, display:'block'}}>CLEARANCE LEVEL</label>
                    <select 
                      className="st-input"
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="Developer">Developer (Standard)</option>
                      <option value="Tester">Tester (QA-Node)</option>
                      <option value="Manager">Manager (Supervisory)</option>
                      <option value="Admin">Admin (Privileged)</option>
                    </select>
                  </div>
                  <button type="submit" className="submit-btn">
                     ADD USER
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="admin-card"
              style={{maxWidth: 700}}
            >
              <h3 className="card-header"><Lock size={20} color="#f59e0b"/> GLOBAL SECURITY POLICY</h3>
              <SettingToggle title="Maintenance Lockdown" desc="Restrict application access to root administrators only." />
              <SettingToggle title="Strict 2FA Enforcement" desc="Require multi-factor authentication for all clearance levels." />
              <SettingToggle title="Quantum-Safe API Throttling" desc="Rate limit cluster calls to 500 requests per clock-cycle." active={true} />
              <SettingToggle title="Cyber-Aurora Theme Sync" desc="Force global high-fidelity dark theme across all nodes." active={true} />
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div 
              key="logs"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="admin-card"
            >
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', flexWrap:'wrap', gap:20}}>
                <h3 className="card-header" style={{margin:0}}><Activity size={20} color="#38bdf8"/> SUBSYSTEM EVENT LOGS</h3>
                <div style={{display:'flex', alignItems:'center', gap:'10px', background: '#0f172a', padding:'8px 15px', borderRadius:12, border:'1px solid #334155'}}>
                  <Search size={16} color="#64748b" />
                  <input placeholder="FILTER LOGS..." style={{background:'transparent', border:'none', outline:'none', fontSize:'12px', color:'white', width:180}} />
                </div>
              </div>
              
              <div style={{overflowX:'auto'}}>
                <table className="audit-table">
                  <thead>
                    <tr>
                      <th>EVENT ACTION</th>
                      <th>ORIGIN ENTITY</th>
                      <th>IP ADDRESS</th>
                      <th>TIMESTAMP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id}>
                        <td style={{fontWeight:'800', color: log.action.includes('Delete') ? '#ef4444' : '#f1f5f9'}}>{log.action.toUpperCase()}</td>
                        <td style={{color:'#94a3b8', fontWeight:700}}>{log.user}</td>
                        <td style={{color:'#64748b', fontFamily:'"Fira Code", monospace'}}>{log.ip}</td>
                        <td style={{color:'#475569', fontSize:12, fontWeight:700}}>{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
const SettingToggle = ({ title, desc, active = false }) => {
  const [isOn, setIsOn] = useState(active);
  return (
    <div className="st-toggle">
      <div>
        <div style={{fontWeight:'800', color:'#f8fafc', fontSize:15}}>{title}</div>
        <div style={{fontSize:'13px', color:'#64748b', marginTop:4}}>{desc}</div>
      </div>
      <div onClick={() => setIsOn(!isOn)} style={{cursor:'pointer'}}>
        {isOn ? <ToggleRight size={44} color="#10b981" /> : <ToggleLeft size={44} color="#334155" />}
      </div>
    </div>
  );
};

export default Admin;