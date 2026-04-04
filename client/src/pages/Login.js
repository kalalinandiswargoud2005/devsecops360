import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, Environment } from '@react-three/drei';
import { User, Lock, ChevronRight, Shield, Box, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- DARK 3D GLOBE BACKGROUND ---
function DarkGlobe() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.001;
    meshRef.current.rotation.z += 0.0005;
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#38bdf8" />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#818cf8" />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={meshRef} args={[4, 64, 64]} scale={1.5} position={[2, 0, -5]}>
           <meshStandardMaterial 
              color="#0f172a" 
              wireframe={true} 
              emissive="#38bdf8"
              emissiveIntensity={0.2}
              transparent 
              opacity={0.3} 
           />
        </Sphere>
      </Float>
      <Environment preset="city" /> 
    </>
  );
}

// --- MAIN AUTH COMPONENT ---
function Login({ setUser, usersDB, setUsersDB }) {
  const [isLogin, setIsLogin] = useState(true);
  const [input, setInput] = useState({ username: '', password: '', role: 'Developer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- CARD PHYSICS ---
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  // --- AUTH LOGIC WITH RBAC ---
  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (isLogin) {
        // LOGIN MODE
        const found = usersDB.find(u => 
          u.username.toLowerCase() === input.username.toLowerCase() && 
          u.password === input.password
        );
        
        if (found) {
          // RBAC Verification
          if (found.role === input.role || found.role === 'Admin') {
             setUser(found);
             navigate('/dashboard'); 
          } else {
             setError(`Clearance Denied: User does not have ${input.role} privileges.`);
             setLoading(false);
          }
        } else {
          setError("Invalid Username or Password");
          setLoading(false);
        }
      } else {
        // REGISTER MODE
        if (usersDB.find(u => u.username.toLowerCase() === input.username.toLowerCase())) {
          setError("User ID already registered");
          setLoading(false);
        } else {
          const newUser = { 
            ...input, 
            id: Date.now(), 
            username: input.username.toLowerCase() 
          };
          setUsersDB([...usersDB, newUser]);
          setUser(newUser);
          navigate('/dashboard');
        }
      }
    }, 1200);
  };

  return (
    <div className="login-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={ref}>
      <style>{`
        .login-wrapper {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
          position: relative;
          overflow: hidden;
          perspective: 1200px;
          font-family: var(--font-sans);
        }
        
        .canvas-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .auth-card {
          width: 90%;
          max-width: 420px;
          padding: 40px;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.05);
          transform-style: preserve-3d;
          pointer-events: auto;
          color: #f8fafc;
        }

        .header-section {
          text-align: center;
          margin-bottom: 30px;
          transform: translateZ(30px);
        }

        .logo-box {
          background: rgba(56, 189, 248, 0.1);
          width: 55px;
          height: 55px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px auto;
          box-shadow: 0 0 20px rgba(56,189,248,0.2);
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .auth-title { font-size: 24px; font-weight: 800; margin: 0 0 5px 0; color: #fff; }
        .auth-sub { font-size: 13px; color: #94a3b8; margin: 0; }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          transform: translateZ(20px);
        }

        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); z-index: 2; color: #64748b; }
        
        .styled-input {
          width: 100%;
          padding: 14px 14px 14px 45px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid #334155;
          border-radius: 12px;
          font-size: 14px;
          color: #f8fafc;
          outline: none;
          transition: 0.3s;
          box-sizing: border-box;
        }
        .styled-input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
        }
        .styled-input::placeholder { color: #64748b; }

        .styled-select {
          width: 100%;
          padding: 14px 14px 14px 45px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid #334155;
          border-radius: 12px;
          font-size: 14px;
          color: #f8fafc;
          outline: none;
          box-sizing: border-box;
          appearance: none;
          cursor: pointer;
        }

        .submit-btn {
          padding: 14px;
          margin-top: 10px;
          background: #38bdf8;
          border: none;
          border-radius: 12px;
          color: #0f172a;
          font-weight: 800;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
          transition: 0.2s;
        }
        .submit-btn:hover:not(:disabled) { background: #0ea5e9; transform: translateY(-2px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .error-box {
          color: #fca5a5;
          font-size: 12px;
          background: rgba(127, 29, 29, 0.4);
          padding: 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .auth-footer { margin-top: 25px; text-align: center; transform: translateZ(20px); }
        .switch-mode { color: #94a3b8; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .switch-mode:hover { color: #38bdf8; }
      `}</style>
      
      {/* 3D BACKGROUND LAYER */}
      <div className="canvas-bg">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <DarkGlobe />
        </Canvas>
      </div>

      {/* LOGIN CARD */}
      <motion.div
        style={{
          rotateX, rotateY,
          transformStyle: "preserve-3d", 
          zIndex: 10,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div className="auth-card">
          <div className="header-section">
            <div className="logo-box">
              <Box size={32} color="#38bdf8" />
            </div>
            <h1 className="auth-title">{isLogin ? 'SYSTEM INITIALIZATION' : 'ENLIST PERSONNEL'}</h1>
            <p className="auth-sub">DevSecOps Workspace Authentication</p>
          </div>

          <form onSubmit={handleAuth} className="auth-form">
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                placeholder="Identification String" 
                className="styled-input" 
                value={input.username}
                onChange={e => setInput({...input, username: e.target.value})} 
                required
              />
            </div>
            
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="Passphrase" 
                className="styled-input" 
                value={input.password}
                onChange={e => setInput({...input, password: e.target.value})} 
                required
              />
            </div>

            {/* RBAC SELECT - Visible in both Login and Registration */}
            <div className="input-wrapper">
              <Shield size={18} className="input-icon" />
              <select className="styled-select" value={input.role} onChange={e => setInput({...input, role: e.target.value})}>
                <option value="Developer">Clearance: Developer</option>
                <option value="Tester">Clearance: Tester</option>
                <option value="Manager">Clearance: Manager</option>
                <option value="Admin">Clearance: Admin</option>
              </select>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-box">
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'VERIFYING...' : (isLogin ? 'AUTHORIZE' : 'ENLIST')} 
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="auth-footer">
            <span className="switch-mode" onClick={() => { setError(''); setIsLogin(!isLogin); }}>
              {isLogin ? "Require Clearance? Enlist here." : "Have active clearance? Authorize."}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;