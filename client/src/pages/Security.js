import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Shield, AlertOctagon, Lock, Bug, CheckCircle, RefreshCw, Server } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"; 

function Security() {
  const [scanning, setScanning] = useState(false);
  const [score, setScore] = useState(85);
  const [vulnerabilities, setVulnerabilities] = useState([
    { id: 'CVE-2024-3094', severity: 'CRITICAL', type: 'Supply Chain', desc: 'Malicious backdoor in XZ Utils', status: 'Open' },
    { id: 'CVE-2023-44487', severity: 'HIGH', type: 'DDoS', desc: 'HTTP/2 Rapid Reset Attack', status: 'Mitigated' },
    { id: 'Vuln-XSS-02', severity: 'MEDIUM', type: 'XSS', desc: 'Unsanitized input in login form', status: 'Open' },
  ]);

  // Simulate a Security Scan
  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScore(Math.floor(Math.random() * 15) + 80); 
      setVulnerabilities(prev => [
        { id: `CVE-2025-${Math.floor(Math.random()*1000)}`, severity: 'LOW', type: 'Config', desc: 'Verbose error logging enabled', status: 'Open' },
        ...prev
      ]);
    }, 2500);
  };

  const severityColor = (sev) => {
    switch(sev) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f5a524';
      case 'MEDIUM': return '#eab308';
      default: return '#38bdf8';
    }
  };

  // Mock Attack Data for Map
  const attacks = [
    { name: "SQL Injection", coordinates: [-74.006, 40.7128] }, // NYC
    { name: "Brute Force", coordinates: [-118.2437, 34.0522] }, // LA
    { name: "DDoS", coordinates: [-97.7431, 30.2672] }, // Austin
  ];

  return (
    <div className="module-wrapper">
      <style>{`
        .module-wrapper {
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
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 40px;
        }

        .page-title { font-size: clamp(24px, 4vw, 32px); font-weight: 800; color: #f8fafc; margin: 0 0 5px 0; }
        .page-sub { color: #94a3b8; margin: 0; font-size: 14px; }

        .scan-btn {
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
          transition: 0.2s;
          box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
        }
        .scan-btn:hover:not(:disabled) { background: #0ea5e9; transform: translateY(-2px); }
        .scan-btn:disabled { opacity: 0.7; cursor: not-allowed; background: #64748b; color: #fff; box-shadow: none; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
           background: #1e293b;
           border: 1px solid #334155;
           padding: 20px;
           border-radius: 16px;
           display: flex;
           flex-direction: column;
           gap: 10px;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 25px;
        }
        @media (min-width: 1024px) {
          .main-grid { grid-template-columns: 2fr 1fr; }
        }

        .panel-box {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .panel-header {
           padding: 15px 20px;
           border-bottom: 1px solid rgba(255,255,255,0.05);
           display: flex;
           align-items: center;
           gap: 10px;
           font-weight: 700;
           color: #94a3b8;
           font-size: 13px;
           letter-spacing: 0.5px;
        }

        .map-container {
           height: 400px;
           position: relative;
           background: rgba(15, 23, 42, 0.4);
        }

        .map-overlay {
           position: absolute;
           bottom: 20px;
           left: 20px;
           background: rgba(15, 23, 42, 0.8);
           backdrop-filter: blur(10px);
           padding: 10px 15px;
           border-radius: 8px;
           font-size: 12px;
           border: 1px solid rgba(239, 68, 68, 0.3);
           color: #ef4444;
           font-weight: 700;
        }

        .vuln-list { padding: 20px; overflow-y: auto; height: 400px; }
        
        .vuln-item {
           background: rgba(15, 23, 42, 0.4);
           padding: 15px;
           border-radius: 12px;
           margin-bottom: 12px;
           border: 1px solid rgba(255,255,255,0.05);
        }

      `}</style>
      
      {/* HEADER */}
      <div className="top-header">
        <div>
          <h1 className="page-title">Security Operations Center (SOC)</h1>
          <p className="page-sub">Real-time Threat Monitoring & Vulnerability Management</p>
        </div>
        <button onClick={runScan} className="scan-btn" disabled={scanning}>
          {scanning ? <RefreshCw className="spin" size={18} color="#fff" /> : <Shield size={18} />}
          {scanning ? "AUDITING..." : "RUN SECURITY AUDIT"}
        </button>
      </div>

      {/* TOP ROW: METRICS */}
      <div className="metrics-grid">
        <MetricCard title="Security Score" value={`${score}`} sub={`/100 · Grade: ${score > 90 ? 'A' : score > 80 ? 'B' : 'C'}`} icon={Shield} color={score > 80 ? '#10b981' : '#f5a524'} />
        <MetricCard title="Active Threats" value="3" sub="Blocked by WAF" icon={AlertOctagon} color="#ef4444" />
        <MetricCard title="Open Vulnerabilities" value={vulnerabilities.length} sub="Needs Remediation" icon={Bug} color="#f5a524" />
        <MetricCard title="Compliance" value="98%" sub="GDPR / SOC2 Ready" icon={CheckCircle} color="#38bdf8" />
      </div>

      <div className="main-grid">
        
        {/* LEFT: THREAT MAP */}
        <div className="panel-box">
          <div className="panel-header">
            <Server size={18} color="#38bdf8" /> 
            <span>LIVE ATTACK MAP (GLOBAL WAF)</span>
          </div>
          <div className="map-container">
            <ComposableMap projection="geoAlbersUsa">
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography key={geo.rsmKey} geography={geo} fill="#334155" stroke="#1e293b" />
                  ))
                }
              </Geographies>
              {attacks.map((marker, i) => (
                <Marker key={i} coordinates={marker.coordinates}>
                  <motion.circle 
                    r={8} fill="#ef4444" opacity={0.6}
                    animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <circle r={4} fill="#ef4444" />
                </Marker>
              ))}
            </ComposableMap>
            <div className="map-overlay">
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                 <div style={{width:'8px', height:'8px', background:'#ef4444', borderRadius:'50%', animation:'spin 1.5s infinite'}}></div>
                 LIVE: BLOCKING MALICIOUS IPs
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: VULNERABILITY LIST */}
        <div className="panel-box">
          <div className="panel-header">
            <Lock size={18} color="#38bdf8" /> 
            <span>VULNERABILITY FEED</span>
          </div>
          <div className="vuln-list">
            <AnimatePresence>
              {vulnerabilities.map((v) => (
                <motion.div 
                  key={v.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="vuln-item"
                  style={{borderLeft: `4px solid ${severityColor(v.severity)}`}}
                >
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <span style={{fontWeight:'700', fontSize:'14px', color:'#f1f5f9'}}>{v.id}</span>
                    <span style={{fontSize:'10px', fontWeight:'800', color: severityColor(v.severity), background: `${severityColor(v.severity)}15`, padding:'4px 8px', borderRadius:'12px', letterSpacing:'0.5px'}}>
                      {v.severity}
                    </span>
                  </div>
                  <div style={{fontSize:'13px', color:'#94a3b8', marginTop:'8px'}}>{v.desc}</div>
                  <div style={{fontSize:'11px', color:'#64748b', marginTop:'12px', display:'flex', gap:'12px', fontWeight:'600'}}>
                    <span style={{background:'rgba(255,255,255,0.05)', padding:'4px 8px', borderRadius:'6px'}}>Type: {v.type}</span>
                    <span style={{background:'rgba(255,255,255,0.05)', padding:'4px 8px', borderRadius:'6px'}}>Status: {v.status}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

const MetricCard = ({ title, value, sub, icon: Icon, color }) => (
  <div className="metric-card">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
      <div>
        <div style={{color:'#94a3b8', fontSize:'13px', fontWeight:'600'}}>{title}</div>
        <div style={{display:'flex', alignItems:'baseline', gap:'8px'}}>
           <div style={{fontSize:'28px', fontWeight:'900', color:'#f8fafc', marginTop:'5px'}}>{value}</div>
        </div>
      </div>
      <div style={{background:`${color}20`, padding:'12px', borderRadius:'12px'}}><Icon size={22} color={color} /></div>
    </div>
    <div style={{marginTop:'auto', paddingTop:'15px'}}>
      <div style={{fontSize:'12px', color:color, background:`${color}15`, display:'inline-block', padding:'4px 10px', borderRadius:'20px', fontWeight:'700'}}>{sub}</div>
    </div>
  </div>
);

export default Security;