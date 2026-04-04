import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CheckCircle, AlertTriangle, TrendingUp, Calendar, Clock, Edit2, Save, X, Activity } from 'lucide-react';

// --- COUNTDOWN COMPONENT ---
const CountdownTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(deadline));

  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / 1000 / 60) % 60),
      seconds: Math.floor((total / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const TimeBlock = ({ value, label }) => (
    <div className="time-block">
      <div className="time-value">{String(value).padStart(2, '0')}</div>
      <div className="time-label">{label}</div>
    </div>
  );

  return (
    <div className="timer-grid">
      <TimeBlock value={timeLeft.days} label="DAYS" />
      <span className="colon">:</span>
      <TimeBlock value={timeLeft.hours} label="HRS" />
      <span className="colon">:</span>
      <TimeBlock value={timeLeft.minutes} label="MIN" />
      <span className="colon">:</span>
      <TimeBlock value={timeLeft.seconds} label="SEC" />
    </div>
  );
};

// --- MAIN STATUS PAGE ---
function Status({ projects, updateProject }) { 
  const { id } = useParams();
  const project = projects.find(p => p.id === Number(id));
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState(project?.deadline || "");

  if (!project) return <div className="status-wrapper">Loading Project Engine...</div>;

  const handleSave = () => {
    updateProject(id, 'deadline', newDate);
    setIsEditing(false);
  };

  // Mock Data
  const burndownData = [
    { day: 'Day 1', remaining: 100, ideal: 100 },
    { day: 'Day 2', remaining: 92, ideal: 85 },
    { day: 'Day 3', remaining: 80, ideal: 70 },
    { day: 'Day 4', remaining: 65, ideal: 55 },
    { day: 'Day 5', remaining: 60, ideal: 40 },
    { day: 'Day 6', remaining: 35, ideal: 25 },
    { day: 'Day 7', remaining: 10, ideal: 10 },
  ];

  const taskDistribution = [
    { name: 'Done', value: 65, color: '#10b981' },
    { name: 'In Progress', value: 25, color: '#38bdf8' },
    { name: 'Bugs', value: 10, color: '#ef4444' },
  ];

  return (
    <div className="status-wrapper">
      <style>{`
        .status-wrapper {
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
          gap: 30px;
          margin-bottom: 40px;
        }

        .page-title {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 5px 0;
        }

        .page-sub { color: #94a3b8; margin: 0; font-size: 14px; }

        .timer-card {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(10px);
          padding: 20px 30px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 320px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        }

        .timer-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #ef4444;
          margin-bottom: 15px;
        }

        .timer-grid { display: flex; align-items: center; gap: 12px; }
        .time-block { text-align: center; min-width: 50px; }
        .time-value { font-size: 36px; font-weight: 900; color: #f1f5f9; line-height: 1; text-shadow: 0 0 20px rgba(56, 189, 248, 0.2); }
        .time-label { font-size: 10px; color: #64748b; font-weight: 700; margin-top: 5px; }
        .colon { font-size: 24px; font-weight: 900; color: #334155; transform: translateY(-5px); }

        .edit-input {
          background: #020617;
          border: 1px solid #334155;
          padding: 10px 15px;
          border-radius: 12px;
          color: #f8fafc;
          outline: none;
          width: 100%;
          font-family: inherit;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .metric-box {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 24px;
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: 0.3s;
        }
        .metric-box:hover { border-color: #38bdf8; transform: translateY(-3px); }

        .main-charts {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          padding-bottom: 50px;
        }
        @media (min-width: 1100px) {
          .main-charts { grid-template-columns: 2fr 1fr; }
        }

        .chart-box {
          background: #1e293b;
          border: 1px solid #334155;
          padding: 30px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
        }

        .chart-title { margin: 0 0 25px 0; font-size: 16px; color: #f8fafc; font-weight: 800; display: flex; align-items: center; gap: 10px; }

        .btn-ghost { background: transparent; border: none; cursor: pointer; color: #64748b; padding: 5px; border-radius: 6px; transition: 0.2s; }
        .btn-ghost:hover { color: #f8fafc; background: rgba(255,255,255,0.05); }

      `}</style>

      {/* HEADER SECTION WITH EDITABLE TIMER */}
      <div className="top-header">
        <div>
          <h1 className="page-title">{project.name} Control Center</h1>
          <p className="page-sub">Operational Status • Sprint 4 Delivery Node</p>
        </div>
        
        {/* TIMER CARD */}
        <div className="timer-card">
          <div className="timer-title">
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <Clock size={16} /> 
              {isEditing ? "ADJUST TIMELINE" : "DEPLOYMENT SHUTDOWN"}
            </div>
            
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-ghost" title="Edit Deadline">
                <Edit2 size={14} />
              </button>
            ) : (
              <div style={{display:'flex', gap:'8px'}}>
                <button onClick={handleSave} className="btn-ghost" style={{color:'#10b981'}} title="Save">
                  <Save size={16} />
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-ghost" style={{color:'#ef4444'}} title="Cancel">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <input 
              type="datetime-local" 
              className="edit-input"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          ) : (
            project.deadline && <CountdownTimer deadline={project.deadline} />
          )}
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="metrics-grid">
        <MetricCard title="System Velocity" value="32 PT" trend="+12.5% Gain" icon={TrendingUp} color="#38bdf8" />
        <MetricCard title="Module Integrity" value="24/30" trend="80% Compliance" icon={CheckCircle} color="#10b981" />
        <MetricCard title="Threat Vectors" value="2" trend="-1 Mitigated" icon={AlertTriangle} color="#ef4444" />
        <MetricCard title="Target Window" value={project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"} trend="Locked" icon={Calendar} color="#8b5cf6" />
      </div>

      {/* CHARTS ROW */}
      <div className="main-charts">
        <div className="chart-box">
          <h3 className="chart-title"><Activity size={18} color="#38bdf8" /> SPRINT ANALYTICS</h3>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={burndownData}>
                <defs>
                  <linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#64748b', fontSize:11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill:'#64748b', fontSize:11}} />
                <Tooltip 
                  contentStyle={{background:'#0f172a', border:'1px solid #334155', borderRadius:'12px'}} 
                  itemStyle={{color:'#38bdf8'}} 
                />
                <Area type="monotone" dataKey="remaining" stroke="#38bdf8" strokeWidth={3} fill="url(#colorStatus)" />
                <Area type="monotone" dataKey="ideal" stroke="#334155" strokeWidth={2} strokeDasharray="8 8" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box">
          <h3 className="chart-title"><TrendingUp size={18} color="#38bdf8" /> NODAL DISTRO</h3>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={taskDistribution} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #334155', borderRadius:'12px'}} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}

const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="metric-box">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
      <div>
        <div style={{color:'#64748b', fontSize:'13px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.5px'}}>{title}</div>
        <div style={{fontSize:'28px', fontWeight:'900', color:'#f8fafc', marginTop:'8px'}}>{value}</div>
      </div>
      <div style={{background:`${color}15`, padding:'12px', borderRadius:'14px'}}><Icon size={22} color={color} /></div>
    </div>
    <div style={{fontSize:'12px', color:color, background:`${color}10`, display:'inline-block', padding:'6px 12px', borderRadius:'10px', fontWeight:'800', width:'fit-content'}}>
      {trend}
    </div>
  </div>
);

export default Status;