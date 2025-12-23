import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Shield, AlertOctagon, Lock, Eye, Bug, CheckCircle, RefreshCw, Server } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"; // Using US map for demo scale, can switch to world

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
      setScore(Math.floor(Math.random() * 15) + 80); // Random score between 80-95
      setVulnerabilities(prev => [
        { id: `CVE-2025-${Math.floor(Math.random()*1000)}`, severity: 'LOW', type: 'Config', desc: 'Verbose error logging enabled', status: 'Open' },
        ...prev
      ]);
    }, 2500);
  };

  const severityColor = (sev) => {
    switch(sev) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#eab308';
      default: return '#3b82f6';
    }
  };

  // Mock Attack Data for Map
  const attacks = [
    { name: "SQL Injection", coordinates: [-74.006, 40.7128] }, // NYC
    { name: "Brute Force", coordinates: [-118.2437, 34.0522] }, // LA
    { name: "DDoS", coordinates: [-97.7431, 30.2672] }, // Austin
  ];

  const chartData = [
    { name: 'Critical', value: 1, color: '#ef4444' },
    { name: 'High', value: 2, color: '#f97316' },
    { name: 'Medium', value: 5, color: '#eab308' },
    { name: 'Low', value: 12, color: '#3b82f6' },
  ];

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Security Operations Center (SOC)</h1>
          <p style={styles.subtitle}>Real-time Threat Monitoring & Vulnerability Management</p>
        </div>
        <button onClick={runScan} style={styles.scanBtn} disabled={scanning}>
          {scanning ? <RefreshCw className="spin" size={18} /> : <Shield size={18} />}
          {scanning ? "Running SAST Scan..." : "Run Security Audit"}
        </button>
      </div>

      {/* TOP ROW: METRICS */}
      <div style={styles.metricsGrid}>
        <MetricCard title="Security Score" value={`${score}/100`} sub="Grade: A-" icon={Shield} color={score > 80 ? '#10b981' : '#f59e0b'} />
        <MetricCard title="Active Threats" value="3" sub="Blocked by WAF" icon={AlertOctagon} color="#ef4444" />
        <MetricCard title="Open Vulnerabilities" value={vulnerabilities.length} sub="Needs Remediation" icon={Bug} color="#f97316" />
        <MetricCard title="Compliance" value="98%" sub="GDPR / SOC2 Ready" icon={CheckCircle} color="#3b82f6" />
      </div>

      <div style={styles.mainGrid}>
        
        {/* LEFT: THREAT MAP */}
        <div style={styles.mapCard}>
          <div style={styles.cardHeader}>
            <Server size={18} color="#64748b" /> 
            <span>LIVE ATTACK MAP (WAF)</span>
          </div>
          <div style={styles.mapContainer}>
            <ComposableMap projection="geoAlbersUsa">
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map(geo => (
                    <Geography key={geo.rsmKey} geography={geo} fill="#e2e8f0" stroke="#cbd5e1" />
                  ))
                }
              </Geographies>
              {attacks.map((marker, i) => (
                <Marker key={i} coordinates={marker.coordinates}>
                  <motion.circle 
                    r={8} fill="#ef4444" opacity={0.5}
                    animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <circle r={4} fill="#ef4444" />
                </Marker>
              ))}
            </ComposableMap>
            <div style={styles.mapOverlay}>
              <div style={{color: '#ef4444', fontWeight: 'bold'}}>• LIVE: BLOCKING IPS</div>
            </div>
          </div>
        </div>

        {/* RIGHT: VULNERABILITY LIST */}
        <div style={styles.vulnCard}>
          <div style={styles.cardHeader}>
            <Lock size={18} color="#64748b" /> 
            <span>VULNERABILITY FEED</span>
          </div>
          <div style={styles.vulnList}>
            <AnimatePresence>
              {vulnerabilities.map((v) => (
                <motion.div 
                  key={v.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{...styles.vulnItem, borderLeft: `4px solid ${severityColor(v.severity)}`}}
                >
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span style={{fontWeight:'700', fontSize:'14px', color:'#334155'}}>{v.id}</span>
                    <span style={{fontSize:'10px', fontWeight:'700', color: severityColor(v.severity), background: `${severityColor(v.severity)}15`, padding:'2px 6px', borderRadius:'4px'}}>
                      {v.severity}
                    </span>
                  </div>
                  <div style={{fontSize:'13px', color:'#64748b', marginTop:'4px'}}>{v.desc}</div>
                  <div style={{fontSize:'11px', color:'#94a3b8', marginTop:'8px', display:'flex', gap:'10px'}}>
                    <span>Type: {v.type}</span>
                    <span>Status: {v.status}</span>
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
  <div style={styles.metricCard}>
    <div style={{display:'flex', justifyContent:'space-between'}}>
      <div>
        <div style={{color:'#64748b', fontSize:'12px', fontWeight:'600', textTransform:'uppercase'}}>{title}</div>
        <div style={{fontSize:'28px', fontWeight:'800', color:'#1e293b', marginTop:'5px'}}>{value}</div>
        <div style={{fontSize:'12px', color: color, marginTop:'5px', fontWeight:'500'}}>{sub}</div>
      </div>
      <div style={{background:`${color}20`, padding:'12px', borderRadius:'12px', height:'fit-content'}}>
        <Icon size={24} color={color} />
      </div>
    </div>
  </div>
);

const styles = {
  container: { padding: '40px', height: '100vh', boxSizing: 'border-box', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '5px' },
  scanBtn: {
    background: '#0f172a', color: 'white', border: 'none', padding: '12px 20px',
    borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
  },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  metricCard: { background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  
  mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', paddingBottom: '50px' },
  
  mapCard: { background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden', display:'flex', flexDirection:'column' },
  mapContainer: { height: '400px', position: 'relative', background: '#f8fafc' },
  mapOverlay: { position: 'absolute', bottom: 20, left: 20, background: 'rgba(255,255,255,0.9)', padding: '10px', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  
  vulnCard: { background: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', display:'flex', flexDirection:'column', height: '450px' },
  cardHeader: { padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display:'flex', alignItems:'center', gap:'10px', fontWeight:'700', color:'#475569', fontSize:'13px' },
  vulnList: { padding: '20px', overflowY: 'auto', flex: 1 },
  vulnItem: { padding: '15px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }
};

// CSS for Spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default Security;