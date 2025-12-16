import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './App.css';
import Poker from './Poker';
// 1. Define Colors for the Chart
const SEVERITY_COLORS = {
  Critical: '#ef4444', // Red
  High: '#f97316',     // Orange
  Medium: '#eab308',   // Yellow
  Low: '#22c55e'       // Green
};

const AGILE_COLORS = ['#3b82f6', '#1f2937']; // Blue & Dark Grey

function App() {
  const [tasks, setTasks] = useState([]);
  const [vulnChartData, setVulnChartData] = useState([]);
  const [totalVulns, setTotalVulns] = useState(0);

  // 2. Fetch Data from the Cloud
  useEffect(() => {
    const API_BASE = 'https://devsecops-backend-g7qn.onrender.com'; // <--- CHECK THIS URL!

    // A. Fetch Tasks
    axios.get(`${API_BASE}/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error("Task Error:", err));

    // B. Fetch Vulnerabilities & Process them for the Chart
    axios.get(`${API_BASE}/vulns`)
      .then(res => {
        const rawData = res.data; // This is the list from the DB
        setTotalVulns(rawData.length);

        // Calculate counts automatically (The "Logic" part)
        const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        rawData.forEach(item => {
          if (counts[item.severity] !== undefined) {
            counts[item.severity]++;
          }
        });

        // Transform into Chart Format
        const processedData = [
          { name: 'Critical', count: counts.Critical, color: SEVERITY_COLORS.Critical },
          { name: 'High', count: counts.High, color: SEVERITY_COLORS.High },
          { name: 'Medium', count: counts.Medium, color: SEVERITY_COLORS.Medium },
          { name: 'Low', count: counts.Low, color: SEVERITY_COLORS.Low },
        ];
        
        setVulnChartData(processedData);
      })
      .catch(err => console.error("Vuln Error:", err));

  }, []);

  // Hardcoded for now (Next Sprint: Connect to Jira)
  const agileData = [
    { name: 'Completed', value: 45 },
    { name: 'Remaining', value: 15 },
  ];

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      
      <nav style={{ padding: '20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#3b82f6' }}>🛡️ DevSecOps 360</h2>
        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Live Security Intelligence 🔴</div>
      </nav>

      <div style={{ padding: '30px' }}>
        
        {/* ROW 1: The Charts */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
          
          {/* Card 1: Live Security Threats */}
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between' }}>
              Active Threats 
              <span style={{ backgroundColor: '#ef4444', padding: '2px 10px', borderRadius: '10px', fontSize: '14px' }}>{totalVulns} Issues</span>
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vulnChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} cursor={{fill: 'transparent'}} />
                <Bar dataKey="count">
                  {vulnChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Card 2: Agile Velocity */}
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0 }}>Sprint Velocity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={agileData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {agileData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={AGILE_COLORS[index % AGILE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: '-140px', color: '#3b82f6', fontSize: '24px', fontWeight: 'bold' }}>
              75%
            </div>
            <div style={{ marginTop: '120px' }}></div>
          </div>

        </div>

        {/* ROW 2: Tasks */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '10px' }}>📋 System Tasks</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #334155' }}>
                <span>{task.title}</span>
                <span style={{ color: task.status === 'Done' ? '#22c55e' : '#eab308' }}>
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '50px', borderTop: '1px solid #334155' }}>
    <Poker />
</div>
        </div>

      </div>
    </div>
  );
}

export default App;