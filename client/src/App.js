import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Poker from './Poker'; // Import your Poker Module
import './App.css';

const SEVERITY_COLORS = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Low: '#22c55e' };
const AGILE_COLORS = ['#3b82f6', '#1f2937'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [vulnChartData, setVulnChartData] = useState([]);
  const [totalVulns, setTotalVulns] = useState(0);
  
  // THE BURNOUT ALGORITHM
  const [burnoutRisk, setBurnoutRisk] = useState("Normal"); // Normal, Warning, Critical
  const SPRINT_VELOCITY = 45; // Hardcoded from your Agile Chart (High speed)

  useEffect(() => {
    // REPLACE WITH YOUR RENDER URL
    const API_BASE = 'https://devsecops-backend-g7qn.onrender.com'; 

    axios.get(`${API_BASE}/tasks`).then(res => setTasks(res.data));

    axios.get(`${API_BASE}/vulns`)
      .then(res => {
        const rawData = res.data;
        setTotalVulns(rawData.length);

        // --- INTELLIGENCE ENGINE ---
        // If team is moving FAST (Velocity > 40) but creating BUGS (Vulns > 4)
        if (SPRINT_VELOCITY > 40 && rawData.length > 4) {
          setBurnoutRisk("CRITICAL"); // 🚨 RED ALERT
        } else if (rawData.length > 2) {
          setBurnoutRisk("WARNING");  // ⚠️ YELLOW ALERT
        } else {
          setBurnoutRisk("NORMAL");   // ✅ GREEN
        }
        // ---------------------------

        const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        rawData.forEach(item => {
          if (counts[item.severity] !== undefined) counts[item.severity]++;
        });

        const processedData = [
          { name: 'Critical', count: counts.Critical, color: SEVERITY_COLORS.Critical },
          { name: 'High', count: counts.High, color: SEVERITY_COLORS.High },
          { name: 'Medium', count: counts.Medium, color: SEVERITY_COLORS.Medium },
          { name: 'Low', count: counts.Low, color: SEVERITY_COLORS.Low },
        ];
        setVulnChartData(processedData);
      })
      .catch(err => console.error(err));
  }, []);

  const agileData = [{ name: 'Completed', value: SPRINT_VELOCITY }, { name: 'Remaining', value: 15 }];

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif', paddingBottom: '50px' }}>
      
      {/* 1. SMART HEADER */}
      <nav style={{ padding: '20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#3b82f6' }}>🛡️ DevSecOps 360</h2>
        
        {/* THE BURNOUT INDICATOR */}
        <div style={{ 
          padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold',
          backgroundColor: burnoutRisk === 'CRITICAL' ? '#ef4444' : (burnoutRisk === 'WARNING' ? '#eab308' : '#22c55e'),
          color: 'white', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          {burnoutRisk === 'CRITICAL' ? '🔥 BURNOUT DETECTED' : (burnoutRisk === 'WARNING' ? '⚠️ HIGH RISK' : '✅ TEAM HEALTHY')}
        </div>
      </nav>

      {/* 2. DASHBOARD CONTENT */}
      <div style={{ padding: '30px' }}>
        
        {/* ALERT BANNER (Only shows when Critical) */}
        {burnoutRisk === 'CRITICAL' && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', 
            padding: '15px', borderRadius: '10px', marginBottom: '20px', color: '#fca5a5', textAlign: 'center' 
          }}>
            <strong>🚨 STOP THE SPRINT!</strong> High Velocity ({SPRINT_VELOCITY}) is causing too many Security Bugs ({totalVulns}).
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
          
          {/* Security Chart */}
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0 }}>Active Threats</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vulnChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} cursor={{fill: 'transparent'}} />
                <Bar dataKey="count"><Cell fill="#8884d8"/></Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Agile Chart */}
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0 }}>Sprint Velocity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={agileData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {agileData.map((entry, index) => <Cell key={`cell-${index}`} fill={AGILE_COLORS[index]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: '-140px', color: '#3b82f6', fontSize: '24px', fontWeight: 'bold' }}>{SPRINT_VELOCITY} pts</div>
            <div style={{ marginTop: '120px' }}></div>
          </div>
        </div>

        {/* 3. POKER MODULE (Integrated) */}
        <div style={{ marginTop: '40px', borderTop: '1px solid #334155', paddingTop: '20px' }}>
          <Poker />
        </div>

      </div>
    </div>
  );
}

export default App;