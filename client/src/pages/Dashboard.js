import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, Plus, MoreVertical, LogOut, Box, ShieldAlert, UserCheck } from 'lucide-react';

function Dashboard({ user, projects, setProjects, setUser }) {
  const navigate = useNavigate();

  // --- LOGIC: CREATE PROJECT ---
  const createProject = () => {
    // RBAC: Only Admin or Managers can create projects theoretically, but let's allow Developer for demo if we want, or restrict it.
    if (user?.role === 'Tester') {
       alert("Testers are not authorized to create new projects.");
       return;
    }
    const name = prompt("Enter Project Name:");
    if (!name) return;

    const newProject = {
      id: Date.now(),
      name: name,
      status: "Planning",
      deadline: new Date().toISOString(),
      planning: {},
      requirements: {}
    };
    setProjects([...projects, newProject]);
  };

  // --- LOGIC: LOGOUT ---
  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
      setUser(null);
      localStorage.removeItem('currentUser');
      navigate('/');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <style>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
          color: #f8fafc;
          font-family: var(--font-sans);
          padding: clamp(20px, 4vw, 60px);
          overflow-x: hidden;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 50px;
          margin-top: 20px;
        }

        .title-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .title {
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 900;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 15px;
          letter-spacing: -1px;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.2);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.5px;
          width: fit-content;
        }
        
        .role-badge.admin {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }

        .btn-group {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .action-btn {
          background: #38bdf8;
          color: #0f172a;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          transition: 0.2s;
        }
        .action-btn:hover { background: #0ea5e9; transform: translateY(-2px); }
        .action-btn.danger { background: #1e293b; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
        .action-btn.danger:hover { background: #7f1d1d; color: #fff; border-color: #ef4444; }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        .project-card {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 25px;
          border-radius: 20px;
          cursor: pointer;
          transition: 0.3s;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .project-card:hover {
          border-color: #38bdf8;
          box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .icon-box {
          background: rgba(56, 189, 248, 0.1);
          padding: 14px;
          border-radius: 14px;
          display: flex;
        }

        .card-title {
          font-size: 20px;
          font-weight: 800;
          margin: 0;
          color: #fff;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .id-badge {
          font-size: 12px;
          color: #64748b;
          font-family: var(--font-mono);
        }
      `}</style>

      {/* HEADER */}
      <div className="header-section">
        <div className="title-group">
          <h1 className="title">
             <Box size={36} color="#38bdf8" /> Team Workspace
          </h1>
          {user && (
            <div className={`role-badge ${user.role === 'Admin' ? 'admin' : ''}`}>
              {user.role === 'Admin' ? <ShieldAlert size={16}/> : <UserCheck size={16}/>}
              CLEARANCE: {user.role.toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="btn-group">
          {user?.role === 'Admin' && (
            <button className="action-btn" style={{background: '#6366f1', color: '#fff'}} onClick={() => navigate('/project/1/admin')}>
               <ShieldAlert size={18} /> ADMIN PANEL
            </button>
          )}

          <button onClick={createProject} className="action-btn">
            <Plus size={18} strokeWidth={3} /> NEW PROJECT
          </button>

          <button onClick={handleLogout} className="action-btn danger">
            <LogOut size={18} strokeWidth={2} /> LOGOUT
          </button>
        </div>
      </div>

      {/* PROJECT GRID */}
      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="project-card"
            onClick={() => navigate(`/project/${project.id}/planning`)}
          >
            <div className="card-header">
              <div className="icon-box">
                <Folder size={32} color="#38bdf8" />
              </div>
              <button style={{background:'transparent', border:'none', cursor:'pointer', padding: 0}}>
                 <MoreVertical size={20} color="#64748b" />
              </button>
            </div>
            
            <h3 className="card-title">{project.name}</h3>
            
            <div className="card-footer">
              <div className="status-badge">{project.status}</div>
              <div className="id-badge">ID: {project.id.toString().slice(-4)}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;