import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database as DbIcon } from 'lucide-react';
import { 
  LayoutDashboard, 
  Code2, 
  Bug, 
  Trello, 
  ShieldCheck, 
  FileText, 
  Settings, 
  LogOut, 
  FolderGit2,
  Globe // <--- RE-ADDED GLOBE
} from 'lucide-react';

function Navbar({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const pathParts = location.pathname.split('/');
  const projectId = pathParts.length > 2 ? pathParts[2] : '1'; 

  if (location.pathname === '/' || location.pathname === '/dashboard') return null;

  const handleLogout = () => {
    if (setUser) setUser(null);
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: `/project/${projectId}/dashboard` },
    { name: 'Planning', icon: Trello, path: `/project/${projectId}/planning` },
    { name: 'Requirements', icon: FileText, path: `/project/${projectId}/requirements` },
    { name: 'Coding', icon: Code2, path: `/project/${projectId}/coding` },
    { name: 'Database', icon: DbIcon, path: `/project/${projectId}/database` },
    { name: 'Testing', icon: Bug, path: `/project/${projectId}/testing` },
    { name: 'API Tester', icon: Globe, path: `/project/${projectId}/api` }, // <--- ADDED API TESTER
    { name: 'Status', icon: FolderGit2, path: `/project/${projectId}/status` },
    { name: 'Security', icon: ShieldCheck, path: `/project/${projectId}/security` },
  ];

  if (user?.role === 'Admin') {
    menuItems.push({ name: 'Admin', icon: Settings, path: `/project/${projectId}/admin` });
  }

  return (
    <motion.div initial={{ x: -250 }} animate={{ x: 0 }} style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>DevSecOps</div>
        <div style={styles.version}>PLATFORM V3.0</div>
      </div>

      <div style={styles.userProfile}>
        <div style={styles.avatar}>{user?.username?.charAt(0).toUpperCase()}</div>
        <div>
          <div style={styles.username}>{user?.username}</div>
          <div style={styles.role}>{user?.role || 'Developer'}</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            style={({ isActive }) => (isActive ? { ...styles.link, ...styles.activeLink } : styles.link)}
          >
            <item.icon size={20} />
            <span style={{marginLeft: '10px'}}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        <LogOut size={18} /> Disconnect
      </button>
    </motion.div>
  );
}

const styles = {
  sidebar: { width: '260px', height: '100vh', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', color: 'white', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 15px rgba(0,0,0,0.3)', zIndex: 100 },
  logo: { padding: '30px 20px', borderBottom: '1px solid #334155' },
  logoIcon: { fontSize: '22px', fontWeight: '800', letterSpacing: '1px', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  version: { fontSize: '10px', color: '#94a3b8', marginTop: '5px', letterSpacing: '2px' },
  userProfile: { display: 'flex', alignItems: 'center', gap: '12px', padding: '20px', background: '#33415550', margin: '15px', borderRadius: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  username: { fontSize: '14px', fontWeight: '600' },
  role: { fontSize: '11px', color: '#94a3b8' },
  nav: { flex: 1, padding: '10px 15px', display: 'flex', flexDirection: 'column', gap: '5px' },
  link: { display: 'flex', alignItems: 'center', padding: '12px 15px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '10px', transition: '0.2s', fontSize: '14px', fontWeight: '500' },
  activeLink: { background: '#3b82f6', color: 'white', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' },
  logoutBtn: { margin: '20px', padding: '12px', background: '#ef444420', color: '#ef4444', border: '1px solid #ef444450', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: '600', transition: '0.2s' }
};

export default Navbar;