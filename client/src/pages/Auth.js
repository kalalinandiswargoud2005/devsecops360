import React, { useState, useRef, useMemo } from 'react';
// FIX: Added 'AnimatePresence' to this import line
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { User, Lock, ChevronRight, Shield, Box, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 3D BACKGROUND COMPONENT ---
function GeometricBackground() {
  const meshRef = useRef();
  const { viewport, mouse } = useThree();

  const Geometries = () => {
    const count = 20;
    const shapes = useMemo(() => {
      const temp = [];
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * viewport.width * 1.5;
        const y = (Math.random() - 0.5) * viewport.height * 1.5;
        const z = (Math.random() - 0.5) * 10 - 5;
        const scale = Math.random() * 0.5 + 0.3;
        temp.push({ position: [x, y, z], scale });
      }
      return temp;
    }, [viewport]);

    return shapes.map((props, i) => (
      <Float speed={2} rotationIntensity={2} floatIntensity={2} key={i}>
        <Icosahedron args={[1, 0]} position={props.position} scale={props.scale}>
          <meshStandardMaterial color="#3b82f6" wireframe={true} transparent opacity={0.15} />
        </Icosahedron>
      </Float>
    ));
  };

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.002;
    // Mouse Parallax
    const x = (mouse.x * viewport.width) / 10;
    const y = (mouse.y * viewport.height) / 10;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y, 0.05);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Geometries />
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1}>
        <mesh ref={meshRef} scale={3}>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            roughness={0.1} 
            metalness={0.1} 
            transmission={0.9} 
            thickness={0.5}
          />
        </mesh>
      </Float>
      <Environment preset="city" /> 
    </>
  );
}

// --- MAIN AUTH COMPONENT ---
function Auth({ setUser, usersDB, setUsersDB }) {
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
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  // --- LOGIN LOGIC ---
  const handleAuth = (e) => {
    e.preventDefault();
    console.log("Attempting Login..."); 
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (isLogin) {
        // Case insensitive login check
        const found = usersDB.find(u => 
          u.username.toLowerCase() === input.username.toLowerCase() && 
          u.password === input.password
        );
        
        if (found) {
          console.log("Login Success!", found);
          setUser(found);
          navigate('/dashboard'); 
        } else {
          console.log("Login Failed");
          setError("Invalid Username or Password");
          setLoading(false);
        }
      } else {
        // Register Logic
        if (usersDB.find(u => u.username.toLowerCase() === input.username.toLowerCase())) {
          setError("User ID already exists");
          setLoading(false);
        } else {
          const newUser = { ...input, username: input.username.toLowerCase() };
          setUsersDB([...usersDB, newUser]);
          setUser(newUser);
          navigate('/dashboard');
        }
      }
    }, 1200);
  };

  return (
    <div style={styles.container} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={ref}>
      
      {/* 3D LAYER */}
      <div style={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <GeometricBackground />
        </Canvas>
      </div>

      {/* LOGIN CARD */}
      <motion.div
        style={{
          rotateX, rotateY,
          transformStyle: "preserve-3d", perspective: 1000, zIndex: 10
        }}
      >
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logoIcon}><Box size={32} color="#2563eb" /></div>
            <h1 style={styles.title}>{isLogin ? 'Welcome Back' : 'Join Team'}</h1>
            <p style={styles.subtitle}>DevSecOps 360 Access</p>
          </div>

          <form onSubmit={handleAuth} style={styles.form}>
            <div style={styles.inputGroup}>
              <User size={18} color="#64748b" style={styles.icon} />
              <input 
                placeholder="Username" 
                style={styles.input} 
                onChange={e => setInput({...input, username: e.target.value})} 
              />
            </div>
            
            <div style={styles.inputGroup}>
              <Lock size={18} color="#64748b" style={styles.icon} />
              <input 
                type="password" 
                placeholder="Password" 
                style={styles.input} 
                onChange={e => setInput({...input, password: e.target.value})} 
              />
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={styles.inputGroup}
                >
                   <Shield size={18} color="#64748b" style={styles.icon} />
                   <select style={styles.select} onChange={e => setInput({...input, role: e.target.value})}>
                    <option value="Developer">Role: Developer</option>
                    <option value="Tester">Role: Tester</option>
                    <option value="Manager">Role: Manager</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.error}>
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? 'Verifying...' : (isLogin ? 'Sign In' : 'Create Account')} 
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div style={styles.footer}>
            <span style={styles.switch} onClick={() => { setError(''); setIsLogin(!isLogin); }}>
              {isLogin ? "No account? Create one" : "Have an account? Login"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- STYLES (Clean Tech) ---
const styles = {
  container: {
    height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden', perspective: '1200px',
    fontFamily: '-apple-system, sans-serif',
  },
  canvasContainer: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
    pointerEvents: 'none' // Ensures clicks pass through 3D layer
  },
  card: {
    width: '380px', padding: '40px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
    transformStyle: 'preserve-3d',
    pointerEvents: 'auto'
  },
  header: { textAlign: 'center', marginBottom: '30px', transform: 'translateZ(30px)' },
  logoIcon: {
    background: 'rgba(37, 99, 235, 0.1)', width: '50px', height: '50px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto'
  },
  title: { fontSize: '22px', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0' },
  subtitle: { fontSize: '13px', color: '#64748b', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', transform: 'translateZ(20px)' },
  inputGroup: { position: 'relative' },
  icon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 },
  input: {
    width: '100%', padding: '14px 14px 14px 45px', background: '#f1f5f9',
    border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', color: '#334155',
    outline: 'none', transition: '0.3s',
  },
  select: {
    width: '100%', padding: '14px 14px 14px 45px', background: '#f1f5f9',
    border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', color: '#334155', outline: 'none'
  },
  button: {
    padding: '14px', marginTop: '10px', background: '#2563eb', border: 'none', borderRadius: '12px',
    color: 'white', fontWeight: '600', fontSize: '15px', cursor: 'pointer',
    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)', transition: '0.3s'
  },
  error: { 
    color: '#ef4444', fontSize: '12px', background: '#fee2e2', padding: '10px', 
    borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' 
  },
  footer: { marginTop: '25px', textAlign: 'center', transform: 'translateZ(20px)' },
  switch: { color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }
};

export default Auth;