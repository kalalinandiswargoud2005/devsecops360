import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, XCircle, FileText, Terminal, Activity, RotateCcw } from 'lucide-react';

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
    <div className="testing-wrapper">
      <style>{`
        .testing-wrapper {
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
        }

        .page-sub { color: #94a3b8; margin: 0; font-size: 14px; }

        .controls {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .styled-select {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid #334155;
          padding: 10px 15px;
          border-radius: 12px;
          color: #f8fafc;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .run-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: 0.2s;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        .run-btn:hover:not(:disabled) { background: #059669; transform: translateY(-2px); }
        .run-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 25px;
        }
        @media (min-width: 1024px) {
          .main-grid { grid-template-columns: 320px 1fr; }
        }

        .stats-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .metric-card {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 20px;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .metric-label { color: #94a3b8; fontSize: 12px; fontWeight: 600; textTransform: uppercase; }
        .metric-value { fontSize: 28px; fontWeight: 900; color: #f8fafc; margin-top: 5px; }

        .progress-panel {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 20px;
          border-radius: 16px;
        }

        .progress-header { margin: 0 0 15px 0; font-size: 14px; color: #94a3b8; font-weight: 700; }

        .progress-bar-bg {
          height: 8px;
          width: 100%;
          background: #0f172a;
          border-radius: 4px;
          overflow: hidden;
        }

        .terminal-panel {
          background: #020617;
          border: 1px solid #1e293b;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .terminal-header {
          background: #0f172a;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #1e293b;
        }

        .terminal-body {
          flex: 1;
          padding: clamp(15px, 2vw, 25px);
          overflow-y: auto;
          color: #e2e8f0;
          font-family: "Fira Code", monospace;
          min-height: 400px;
          max-height: 600px;
        }

        .log-line {
          margin-bottom: 8px;
          display: flex;
          gap: 12px;
        }

        .timestamp { opacity: 0.3; font-size: 11px; white-space: nowrap; }

        .clear-btn { background: transparent; border: none; color: #64748b; cursor: pointer; transition: 0.2s; }
        .clear-btn:hover { color: #f8fafc; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
      
      {/* HEADER */}
      <div className="top-header">
        <div>
          <h1 className="page-title">QA Automation Lab</h1>
          <p className="page-sub">Execute automated test pipelines and view coverage reports.</p>
        </div>
        
        <div className="controls">
          <select 
            className="styled-select" 
            value={activeSuite} 
            onChange={(e) => setActiveSuite(e.target.value)}
            disabled={isRunning}
          >
            <option value="unit">📦 Unit Test Engine</option>
            <option value="integration">🔗 Integration Layer</option>
            <option value="e2e">🌍 E2E Interface</option>
          </select>

          <button 
            onClick={runTests} 
            disabled={isRunning}
            className="run-btn"
          >
            {isRunning ? <Activity className="spin" size={18} /> : <Play size={18} />}
            {isRunning ? "EXECUTING..." : "RUN SUITE"}
          </button>
        </div>
      </div>

      {/* MAIN DASHBOARD GRID */}
      <div className="main-grid">
        
        {/* LEFT: STATUS CARDS */}
        <div className="stats-column">
          <StatCard title="Total Modules" value={stats.total} icon={FileText} color="#38bdf8" />
          <StatCard title="Passed Cases" value={stats.pass} icon={CheckCircle} color="#10b981" />
          <StatCard title="Failures" value={stats.fail} icon={XCircle} color="#ef4444" />
          
          {/* Progress Bar Card */}
          <div className="progress-panel">
            <h3 className="progress-header">Pipeline Status</h3>
            <div className="progress-bar-bg">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                style={{
                  height: '100%',
                  background: stats.fail > 0 ? '#ef4444' : '#38bdf8' 
                }} 
              />
            </div>
            <div style={{textAlign: 'right', marginTop: '12px', fontWeight: '900', color: '#38bdf8', fontSize: '18px'}}>
              {progress}%
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE TERMINAL */}
        <div className="terminal-panel">
          <div className="terminal-header">
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
              <Terminal size={16} color="#38bdf8" />
              <span style={{color: '#94a3b8', fontSize: '11px', fontWeight: '800', letterSpacing: '1px'}}>SECURE SHELL OUTPUT</span>
            </div>
            <button onClick={() => setLogs([])} className="clear-btn"><RotateCcw size={16} /></button>
          </div>
          
          <div className="terminal-body">
            <AnimatePresence>
              {logs.length === 0 && <div style={{color:'#334155', fontStyle:'italic'}}>System idle. Awaiting execution command...</div>}
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="log-line"
                  style={{
                    color: log.includes("FAIL") ? '#ef4444' : log.includes("PASS") ? '#10b981' : '#e2e8f0',
                  }}
                >
                  <span className="timestamp">[{new Date().toLocaleTimeString()}]</span>
                  <span style={{flex:1}}>{log}</span>
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
    className="metric-card"
    whileHover={{ y: -2, borderColor: color }}
  >
    <div>
      <div className="metric-label">{title}</div>
      <div className="metric-value">{value}</div>
    </div>
    <div style={{padding:'12px', borderRadius:'12px', background: `${color}15`}}>
      <Icon size={24} color={color} />
    </div>
  </motion.div>
);

export default Testing;