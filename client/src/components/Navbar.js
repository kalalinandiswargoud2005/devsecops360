import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Database as DbIcon, Radio, Zap, LayoutDashboard, Code2, Bug, Trello, ShieldCheck, FileText, Settings, LogOut, Globe } from 'lucide-react';
function Navbar({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const pathParts = location.pathname.split('/');
  const projectId = pathParts.length > 2 ? pathParts[2] : '1'; 

  if (location.pathname === '/' || location.pathname === '/dashboard') return null;

  const handleLogout = () => {
    if (setUser) setUser(null);
    localStorage.removeItem('devsecops_user');
    navigate('/');
  };

  const menuItems = [
    { name: 'Terminal', icon: LayoutDashboard, path: `/project/${projectId}/dashboard` },
    { name: 'Planning', icon: Trello, path: `/project/${projectId}/planning` },
    { name: 'Requirements', icon: FileText, path: `/project/${projectId}/requirements` },
    { name: 'Coding IDE', icon: Code2, path: `/project/${projectId}/coding` },
    { name: 'Database', icon: DbIcon, path: `/project/${projectId}/database` },
    { name: 'QA Lab', icon: Bug, path: `/project/${projectId}/testing` },
    { name: 'API Gateway', icon: Globe, path: `/project/${projectId}/api` }, 
    { name: 'Status', icon: Zap, path: `/project/${projectId}/status` },
    { name: 'Security SOC', icon: ShieldCheck, path: `/project/${projectId}/security` },
  ];

  if (user?.role === 'Admin') {
    menuItems.push({ name: 'Root Admin', icon: Settings, path: `/project/${projectId}/admin` });
  }

  return (
    <motion.div 
      initial={{ x: -300, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="nav-container"
    >
      <style>{`
        .nav-container {
          width: 280px;
          height: 100vh;
          background: linear-gradient(165deg, rgba(15, 23, 42, 0.9), rgba(2, 6, 23, 0.95));
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          box-shadow: 15px 0 50px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }

        .nav-container::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle at center, rgba(56, 189, 248, 0.03) 0%, transparent 70%);
          pointer-events: none;
          animation: slow-rotate 20s linear infinite;
        }

        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .branding {
          padding: 50px 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
        }

        .brand-name {
          font-size: 28px;
          font-weight: 950;
          letter-spacing: -1.5px;
          background: linear-gradient(to right, #00d2ff, #3a7bd5, #00d2ff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
          gap: 14px;
          animation: shine 3s linear infinite;
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }

        .brand-sub {
          font-size: 11px;
          font-weight: 900;
          color: #475569;
          letter-spacing: 5px;
          margin-top: 12px;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .user-block {
          margin: 30px 20px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.01);
        }
        .user-block:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(6, 182, 212, 0.4);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(6, 182, 212, 0.1);
        }

        .u-avatar {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: white;
          font-size: 22px;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .u-info { line-height: 1.4; }
        .u-name { font-size: 16px; font-weight: 900; color: #f8fafc; letter-spacing: 0.5px; }
        .u-role { font-size: 12px; font-weight: 800; color: #22d3ee; text-transform: uppercase; margin-top: 2px; letter-spacing: 1px; }

        .items-list {
          flex: 1;
          padding: 10px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 14px 22px;
          color: #64748b;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        .nav-item:hover {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.04);
          padding-left: 28px;
        }
        .nav-item.active { 
          background: linear-gradient(90deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15)); 
          color: #f8fafc; 
          border: 1px solid rgba(6, 182, 212, 0.3);
          box-shadow: 0 10px 25px rgba(6, 182, 212, 0.2);
          padding-left: 28px;
          position: relative;
        }
        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%; width: 4px;
          background: #22d3ee;
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 15px #22d3ee;
        }

        .nav-item svg { transition: all 0.3s; opacity: 0.7; }
        .nav-item:hover svg { opacity: 1; transform: scale(1.1); color: #22d3ee; }
        .nav-item.active svg { opacity: 1; transform: scale(1.15); color: #22d3ee; filter: drop-shadow(0 0 8px #22d3ee); }

        .logout-section {
          padding: 30px 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .logout-btn {
          width: 100%;
          padding: 16px;
          background: rgba(239, 68, 68, 0.08);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 20px;
          font-weight: 900;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .logout-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
          transform: translateY(-3px);
        }

        /* Custom Scrollbar */
        .items-list::-webkit-scrollbar { width: 5px; }
        .items-list::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.2); border-radius: 10px; }
        .items-list::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.4); }
      `}</style>

      <div className="branding">
        <motion.div 
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="brand-name"
        >
          <Radio size={32}/> DevSecOps360
        </motion.div>
        <div className="brand-sub">PLATINUM ACCESS V4.5</div>
      </div>

      <div className="user-block">
        <div className="u-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
        <div className="u-info">
          <div className="u-name">{user?.username}</div>
          <div className="u-role">{user?.role}</div>
        </div>
      </div>

      <nav className="items-list">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={22} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> DISCONNECT INTERFACE
        </button>
      </div>
    </motion.div>
  );
}

export default Navbar;