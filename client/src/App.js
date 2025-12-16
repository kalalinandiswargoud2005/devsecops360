import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './App.css';

// 1. Simulation Data (This matches your Vision Image for "Security Threats")
const vulnerabilityData = [
  { name: 'Critical', count: 3, color: '#ef4444' }, // Red
  { name: 'High', count: 8, color: '#f97316' },    // Orange
  { name: 'Medium', count: 12, color: '#eab308' }, // Yellow
  { name: 'Low', count: 5, color: '#22c55e' },    // Green
];

const agileData = [
  { name: 'Completed', value: 45 },
  { name: 'Remaining', value: 15 },
];
const COLORS = ['#3b82f6', '#1f2937']; // Blue & Dark Grey

function App() {
  const [tasks, setTasks] = useState([]);

  // 2. Fetch Real Data from your Cloud Backend
  useEffect(() => {
    axios.get('https://devsecops-backend-g7qn.onrender.com//tasks') // <--- CHECK THIS URL!
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error connecting to backend:", error));
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Top Navigation */}
      <nav style={{ padding: '20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#3b82f6' }}>🛡️ DevSecOps 360</h2>
        <div style={{ fontSize: '14px', color: '#94a3b8' }}>User: Admin | Status: Online 🟢</div>
      </nav>

      <div style={{ padding: '30px' }}>
        
        {/* ROW 1: The Charts */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
          
          {/* Card 1: Security Threats */}
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0 }}>Active Security Threats</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vulnerabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Bar dataKey="count" fill="#8884d8">
                  {vulnerabilityData.map((entry, index) => (
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: '-140px', color: '#3b82f6', fontSize: '24px', fontWeight: 'bold' }}>
              75%
            </div>
            <div style={{ marginTop: '120px' }}></div> {/* Spacer to fix layout */}
          </div>

        </div>

        {/* ROW 2: The Real Data List */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '10px' }}>📋 System Tasks (Real DB Data)</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #334155' }}>
                <span>{task.title}</span>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px',
                  backgroundColor: task.status === 'Done' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                  color: task.status === 'Done' ? '#22c55e' : '#eab308'
                }}>
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;