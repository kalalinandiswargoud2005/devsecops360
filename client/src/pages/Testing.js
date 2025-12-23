import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, XCircle, AlertTriangle, FileText, Terminal, Activity, RotateCcw } from 'lucide-react';

function Testing() {
  const [activeSuite, setActiveSuite] = useState('unit'); // unit | integration | e2e
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ pass: 0, fail: 0, total: 0 });
  
  const consoleEndRef = useRef(null);

  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // --- TEST SIMULATION ENGINE ---
  const runTests = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs(["Initializing Test Runner v4.2.0...", "Loading environment variables...", "Compiling source code..."]);
    setProgress(0);
    setStats({ pass: 0, fail: 0, total: 0 });

    let currentProgress = 0;
    let passed = 0;
    let failed = 0;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setIsRunning(false);
        setLogs(prev => [...prev, `✅ TEST SUITE COMPLETED. Passed: ${passed} | Failed: ${failed}`]);
      } else {
        // Generate random test log
        const isPass = Math.random() > 0.1; // 90% pass rate
        if (isPass) passed++; else failed++;
        
        const testName = `Test_Case_${Math.floor(Math.random() * 9000) + 1000}`;
        const logMsg = isPass 
          ? `PASS: ${testName} completed in ${Math.floor(Math.random() * 50)}ms`
          : `FAIL: ${testName} - NullPointerException at line ${Math.floor(Math.random() * 100)}`;
        
        setLogs(prev => [...prev, logMsg]);
      }

      setProgress(currentProgress);
      setStats({ pass: passed, fail: failed, total: passed + failed });

    }, 800); // Speed of logs
  };

  return (
    <div style={styles.container}>
      
      {/* 1. HEADER & CONTROLS */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>QA Automation Lab</h1>
          <p style={styles.subtitle}>Execute automated test pipelines and view coverage reports.</p>
        </div>
        
        <div style={styles.controls}>
          <select 
            style={styles.select} 
            value={activeSuite} 
            onChange={(e) => setActiveSuite(e.target.value)}
            disabled={isRunning}
          >
            <option value="unit">📦 Unit Tests (Jest)</option>
            <option value="integration">🔗 Integration Tests</option>
            <option value="e2e">🌍 E2E (Selenium/Cypress)</option>
          </select>

          <button 
            onClick={runTests} 
            disabled={isRunning}
            style={{...styles.runBtn, opacity: isRunning ? 0.7 : 1}}
          >
            {isRunning ? <Activity className="spin" size={18} /> : <Play size={18} />}
            {isRunning ? "Running..." : "Execute Suite"}
          </button>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD GRID */}
      <div style={styles.grid}>
        
        {/* LEFT: STATUS CARDS */}
        <div style={styles.statsColumn}>
          <StatCard title="Total Tests" value={stats.total} icon={FileText} color="#64748b" />
          <StatCard title="Passed" value={stats.pass} icon={CheckCircle} color="#10b981" />
          <StatCard title="Failed" value={stats.fail} icon={XCircle} color="#ef4444" />
          
          {/* Progress Bar Card */}
          <div style={styles.card}>
            <h3 style={styles.cardHeader}>Suite Progress</h3>
            <div style={styles.progressBarBg}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                style={{
                  ...styles.progressBarFill,
                  background: stats.fail > 0 ? '#ef4444' : '#3b82f6' // Red if error, Blue if clean
                }} 
              />
            </div>
            <div style={{textAlign: 'right', marginTop: '10px', fontWeight: 'bold', color: '#64748b'}}>
              {progress}%
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE TERMINAL */}
        <div style={styles.terminalContainer}>
          <div style={styles.terminalHeader}>
            <Terminal size={16} color="#94a3b8" />
            <span style={{color: '#94a3b8', fontSize: '12px', fontWeight: '600'}}>CONSOLE OUTPUT</span>
            <button onClick={() => setLogs([])} style={styles.clearBtn}><RotateCcw size={14} /></button>
          </div>
          
          <div style={styles.terminalBody}>
            <AnimatePresence>
              {logs.length === 0 && <div style={{color:'#475569', fontStyle:'italic'}}>Ready to run tests...</div>}
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    marginBottom: '6px',
                    color: log.includes("FAIL") ? '#ef4444' : log.includes("PASS") ? '#10b981' : '#e2e8f0',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '13px'
                  }}
                >
                  <span style={{opacity:0.5, marginRight:'10px'}}>{new Date().toLocaleTimeString()}</span>
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={consoleEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper Component for Stats
const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div 
    style={styles.card}
    whileHover={{ y: -2 }}
  >
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div>
        <div style={{fontSize:'12px', color:'#64748b', fontWeight:'600', textTransform:'uppercase'}}>{title}</div>
        <div style={{fontSize:'28px', fontWeight:'800', color: '#1e293b'}}>{value}</div>
      </div>
      <div style={{padding:'10px', borderRadius:'10px', background: `${color}20`}}>
        <Icon size={24} color={color} />
      </div>
    </div>
  </motion.div>
);

const styles = {
  container: { padding: '40px', height: '100vh', boxSizing: 'border-box', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '5px' },
  controls: { display: 'flex', gap: '15px' },
  select: {
    padding: '10px 15px', borderRadius: '10px', border: '1px solid #e2e8f0',
    background: 'white', color: '#334155', fontWeight: '500', outline: 'none'
  },
  runBtn: {
    background: '#10b981', color: 'white', border: 'none', padding: '10px 20px',
    borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
  },
  grid: { display: 'flex', gap: '25px', height: 'calc(100vh - 150px)' },
  statsColumn: { width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: {
    background: 'white', padding: '20px', borderRadius: '16px',
    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  progressBarBg: {
    height: '8px', width: '100%', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginTop: '15px'
  },
  progressBarFill: { height: '100%', borderRadius: '4px' },
  terminalContainer: {
    flex: 1, background: '#0f172a', borderRadius: '16px', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  terminalHeader: {
    background: '#1e293b', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: '1px solid #334155'
  },
  terminalBody: {
    flex: 1, padding: '20px', overflowY: 'auto', color: '#e2e8f0'
  },
  clearBtn: { background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' },
  cardHeader: { margin: 0, fontSize: '14px', color: '#334155' }
};

// CSS for Spin Animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default Testing;