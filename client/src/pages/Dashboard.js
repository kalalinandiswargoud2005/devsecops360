import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, Plus, MoreVertical, LogOut, Box } from 'lucide-react';

function Dashboard({ projects, setProjects }) {
  const navigate = useNavigate();

  // --- LOGIC: CREATE PROJECT ---
  const createProject = () => {
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
      navigate('/'); // Or redirect to login logic
    }
  };

  return (
    <div style={styles.container}>
      {/* 3D BACKGROUND CANVAS */}
      <StarfieldBackground />

      {/* HEADER */}
      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
               <Box size={32} color="#38bdf8" style={{marginBottom:'-5px'}}/> Team Workspace
            </h1>
            <p style={styles.subtitle}>Select a project file to begin development</p>
          </div>
          
          <div style={{display:'flex', gap:'20px'}}>
            {/* 3D NEW PROJECT BUTTON */}
            <button onClick={createProject} className="btn-3d-blue" style={styles.btn3d}>
              <div style={styles.btnContent}>
                <Plus size={20} strokeWidth={3} /> NEW PROJECT
              </div>
            </button>

            {/* 3D LOGOUT BUTTON */}
            <button onClick={handleLogout} className="btn-3d-red" style={styles.btn3d}>
              <div style={styles.btnContent}>
                <LogOut size={20} strokeWidth={3} />
              </div>
            </button>
          </div>
        </div>

        {/* PROJECT GRID */}
        <div style={styles.grid}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              whileHover={{ 
                scale: 1.05, 
                translateY: -10, 
                rotateX: 5,
                rotateY: 5,
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" 
              }}
              style={styles.folderCard}
              onClick={() => navigate(`/project/${project.id}/planning`)}
            >
              <div style={styles.cardGlass} /> {/* Shine Effect */}
              
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>
                  <Folder size={28} color="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                </div>
                <button style={{background:'transparent', border:'none', cursor:'pointer'}}>
                   <MoreVertical size={20} color="#94a3b8" />
                </button>
              </div>
              
              <h3 style={styles.projectName}>{project.name}</h3>
              
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={styles.statusBadge}>{project.status}</div>
                <div style={styles.idBadge}>ID: {project.id.toString().slice(-4)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CSS FOR 3D BUTTONS */}
      <style>{`
        .btn-3d-blue {
          background: #3b82f6;
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          font-weight: 800;
          font-size: 14px;
          transition: transform 0.1s;
          box-shadow: 0px 6px 0px #1d4ed8, 0px 10px 20px rgba(0,0,0,0.2);
          position: relative;
          top: 0;
        }
        .btn-3d-blue:active {
          top: 6px;
          box-shadow: 0px 0px 0px #1d4ed8, 0px 0px 0px rgba(0,0,0,0.2);
        }

        .btn-3d-red {
          background: #ef4444;
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          font-weight: 800;
          transition: transform 0.1s;
          box-shadow: 0px 6px 0px #b91c1c, 0px 10px 20px rgba(0,0,0,0.2);
          position: relative;
          top: 0;
        }
        .btn-3d-red:active {
          top: 6px;
          box-shadow: 0px 0px 0px #b91c1c, 0px 0px 0px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

// --- 3D STARFIELD BACKGROUND COMPONENT ---
const StarfieldBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width, // Depth
    }));

    const animate = () => {
      ctx.fillStyle = '#0f172a'; // Dark Slate BG
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        // Move star closer
        star.z -= 2; 
        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }

        // Project 3D to 2D
        const x = (star.x - width / 2) * (width / star.z) + width / 2;
        const y = (star.y - height / 2) * (width / star.z) + height / 2;
        const size = (width / star.z) * 1.5;

        // Draw Star
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Connect lines if close (Constellation effect)
        // Optimization: only check a few stars to keep FPS high
      });
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} style={styles.canvas} />;
};

const styles = {
  container: { position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0f172a' },
  canvas: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 },
  content: { position: 'relative', zIndex: 10, padding: '40px', maxWidth: '1400px', margin: '0 auto' },
  
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' },
  title: { fontSize: '36px', color: '#f8fafc', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '15px', textShadow: '0 0 20px rgba(56,189,248,0.5)' },
  subtitle: { color: '#94a3b8', marginTop: '10px', fontSize: '16px' },

  btn3d: { padding: '0' },
  btnContent: { padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' },
  
  folderCard: {
    background: 'rgba(30, 41, 59, 0.6)', 
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)', 
    padding: '25px', borderRadius: '24px',
    cursor: 'pointer', position: 'relative', overflow: 'hidden',
    transformStyle: 'preserve-3d', // Enables 3D rotation
  },
  
  cardGlass: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
    pointerEvents: 'none'
  },

  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  iconBox: { background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '14px', boxShadow: '0 0 15px rgba(56,189,248,0.2)' },
  
  projectName: { fontSize: '20px', color: '#f8fafc', margin: '0 0 15px 0', fontWeight: '700', letterSpacing: '0.5px' },
  
  statusBadge: { 
    fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
    color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.2)'
  },
  idBadge: { fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }
};

export default Dashboard;