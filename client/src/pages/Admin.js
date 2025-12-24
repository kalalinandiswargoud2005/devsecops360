import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Activity, Plus, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react';

function Admin({ usersDB, setUsersDB }) {
  const [activeTab, setActiveTab] = useState('team'); // team | settings | logs
  const [newUser, setNewUser] = useState({ username: '', password: '123', role: 'Developer' });
  
  // Fake Logs for Demo
  const [logs] = useState([
    { id: 1, action: 'User Login', user: 'admin', time: '10:42 AM', ip: '192.168.1.4' },
    { id: 2, action: 'Project Created', user: 'manager', time: '09:15 AM', ip: '192.168.1.12' },
    { id: 3, action: 'Security Scan', user: 'system', time: '02:00 AM', ip: 'localhost' },
    { id: 4, action: 'User Deleted', user: 'admin', time: 'Yesterday', ip: '192.168.1.4' },
  ]);

  // --- ACTIONS ---
  const addUser = (e) => {
    e.preventDefault();
    if (!newUser.username) return;
    
    // Add new user with a unique ID
    setUsersDB([...usersDB, { ...newUser, id: Date.now() }]);
    setNewUser({ username: '', password: '123', role: 'Developer' });
  };

  const removeUser = (userId) => {
    if (window.confirm(`Are you sure you want to remove this user?`)) {
      setUsersDB(usersDB.filter(u => u.id !== userId));
    }
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>System Administration</h1>
          <p style={styles.subtitle}>Manage access, configurations, and audit trails.</p>
        </div>
        <div style={styles.badge}>Admin Access Granted</div>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <TabButton id="team" label="Team Management" icon={Users} active={activeTab} set={setActiveTab} />
        <TabButton id="settings" label="System Config" icon={Shield} active={activeTab} set={setActiveTab} />
        <TabButton id="logs" label="Audit Logs" icon={Activity} active={activeTab} set={setActiveTab} />
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={styles.content}>
        <AnimatePresence mode='wait'>
          
          {/* TAB 1: TEAM MANAGEMENT */}
          {activeTab === 'team' && (
            <motion.div 
              key="team"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={styles.grid}
            >
              {/* User List */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Active Users ({usersDB.length})</h3>
                <div style={styles.userList}>
                  {usersDB.map((u) => (
                    <div key={u.id} style={styles.userRow}> {/* Fixed Key to use ID */}
                      <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div style={styles.avatar}>{u.username[0].toUpperCase()}</div>
                        <div>
                          <div style={{fontWeight:'700', color:'#334155'}}>{u.username}</div>
                          <div style={{fontSize:'12px', color:'#64748b'}}>{u.role}</div>
                        </div>
                      </div>
                      {u.username !== 'admin' && (
                        <button onClick={() => removeUser(u.id)} style={styles.deleteBtn} title="Remove User">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add User Form */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Invite New Member</h3>
                <form onSubmit={addUser} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                  <div>
                    <label style={styles.label}>Username</label>
                    <input 
                      style={styles.input} 
                      value={newUser.username}
                      onChange={e => setNewUser({...newUser, username: e.target.value})}
                      placeholder="jdoe"
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Role Assignment</label>
                    <select 
                      style={styles.input}
                      value={newUser.role}
                      onChange={e => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="Developer">Developer</option>
                      <option value="Tester">Tester</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <button type="submit" style={styles.addBtn}>
                    <Plus size={18} /> Add User
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={styles.settingsContainer}
            >
              <SettingToggle title="Maintenance Mode" desc="Disable access for non-admins" />
              <SettingToggle title="Two-Factor Auth (2FA)" desc="Enforce 2FA for all Developer accounts" />
              <SettingToggle title="API Rate Limiting" desc="Limit external API calls to 100/min" active={true} />
              <SettingToggle title="Dark Mode Default" desc="Set dark theme as default for new users" />
            </motion.div>
          )}

          {/* TAB 3: AUDIT LOGS */}
          {activeTab === 'logs' && (
            <motion.div 
              key="logs"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={styles.card}
            >
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h3 style={styles.cardTitle}>Recent Activity</h3>
                <div style={styles.searchBox}>
                  <Search size={14} color="#94a3b8" />
                  <input placeholder="Search logs..." style={{border:'none', outline:'none', fontSize:'13px'}} />
                </div>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr style={{textAlign:'left', color:'#64748b', fontSize:'13px'}}>
                    <th style={{paddingBottom:'10px'}}>Action</th>
                    <th style={{paddingBottom:'10px'}}>User</th>
                    <th style={{paddingBottom:'10px'}}>IP Address</th>
                    <th style={{paddingBottom:'10px'}}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id} style={{borderTop:'1px solid #f1f5f9'}}>
                      <td style={{padding:'12px 0', fontWeight:'600', color:'#334155'}}>{log.action}</td>
                      <td style={{padding:'12px 0', color:'#475569'}}>{log.user}</td>
                      <td style={{padding:'12px 0', color:'#94a3b8', fontFamily:'monospace'}}>{log.ip}</td>
                      <td style={{padding:'12px 0', color:'#64748b'}}>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
const TabButton = ({ id, label, icon: Icon, active, set }) => (
  <button 
    onClick={() => set(id)} 
    style={{
      ...styles.tabBtn,
      background: active === id ? '#eff6ff' : 'transparent',
      color: active === id ? '#2563eb' : '#64748b',
    }}
  >
    <Icon size={18} /> {label}
  </button>
);

const SettingToggle = ({ title, desc, active = false }) => {
  const [isOn, setIsOn] = useState(active);
  return (
    <div style={styles.toggleRow}>
      <div>
        <div style={{fontWeight:'700', color:'#334155'}}>{title}</div>
        <div style={{fontSize:'13px', color:'#64748b'}}>{desc}</div>
      </div>
      <div onClick={() => setIsOn(!isOn)} style={{cursor:'pointer'}}>
        {isOn ? <ToggleRight size={40} color="#10b981" /> : <ToggleLeft size={40} color="#cbd5e1" />}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', height: '100vh', boxSizing: 'border-box', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '5px' },
  badge: { background:'#fee2e2', color:'#ef4444', padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'700' },
  
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px', background: 'white', padding: '5px', borderRadius: '12px', width: 'fit-content', border: '1px solid #e2e8f0' },
  tabBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.2s' },
  
  content: { maxWidth: '1000px' },
  grid: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px' },
  
  card: { background: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  cardTitle: { margin: '0 0 20px 0', fontSize: '16px', color: '#334155', fontWeight:'700' },
  
  userList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  userRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #f8fafc' },
  avatar: { width: '36px', height: '36px', background: '#3b82f6', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
  deleteBtn: { background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
  
  label: { fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '5px', display: 'block' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', marginBottom: '5px', boxSizing:'border-box' },
  addBtn: { width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '10px' },
  
  settingsContainer: { display: 'flex', flexDirection: 'column', gap: '20px', background: 'white', padding: '30px', borderRadius: '16px', border: '1px solid #f1f5f9' },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #f8fafc' },
  
  table: { width: '100%', borderCollapse: 'collapse' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }
};

export default Admin;