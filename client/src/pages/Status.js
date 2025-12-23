import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CheckCircle, AlertTriangle, TrendingUp, Calendar, Clock, Edit2, Save, X } from 'lucide-react';

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
    <div style={styles.timeBlock}>
      <div style={styles.timeValue}>{String(value).padStart(2, '0')}</div>
      <div style={styles.timeLabel}>{label}</div>
    </div>
  );

  return (
    <div style={styles.timerGrid}>
      <TimeBlock value={timeLeft.days} label="DAYS" />
      <span style={styles.colon}>:</span>
      <TimeBlock value={timeLeft.hours} label="HRS" />
      <span style={styles.colon}>:</span>
      <TimeBlock value={timeLeft.minutes} label="MIN" />
      <span style={styles.colon}>:</span>
      <TimeBlock value={timeLeft.seconds} label="SEC" />
    </div>
  );
};

// --- MAIN STATUS PAGE ---
function Status({ projects, updateProject }) { // <--- Added updateProject prop
  const { id } = useParams();
  const project = projects.find(p => p.id === Number(id));
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState(project?.deadline || "");

  if (!project) return <div style={{padding:40}}>Loading...</div>;

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
    { name: 'In Progress', value: 25, color: '#3b82f6' },
    { name: 'Bugs', value: 10, color: '#ef4444' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
      
      {/* HEADER SECTION WITH EDITABLE TIMER */}
      <div style={styles.topSection}>
        <div>
          <h1 style={styles.title}>Project Status: {project.name}</h1>
          <p style={styles.subtitle}>Sprint 4 • Release Candidate v2.1</p>
        </div>
        
        {/* TIMER CARD */}
        <div style={styles.timerContainer}>
          <div style={styles.timerHeader}>
            <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
              <Clock size={16} color="#ef4444" /> 
              {isEditing ? "SET NEW DEADLINE" : "TIME REMAINING"}
            </div>
            
            {/* Edit Controls */}
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} style={styles.iconBtn} title="Edit Deadline">
                <Edit2 size={14} />
              </button>
            ) : (
              <div style={{display:'flex', gap:'5px'}}>
                <button onClick={handleSave} style={{...styles.iconBtn, color:'#10b981'}} title="Save">
                  <Save size={14} />
                </button>
                <button onClick={() => setIsEditing(false)} style={{...styles.iconBtn, color:'#ef4444'}} title="Cancel">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Render Timer OR Input */}
          {isEditing ? (
            <input 
              type="datetime-local" 
              style={styles.dateInput}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          ) : (
            project.deadline && <CountdownTimer deadline={project.deadline} />
          )}
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={styles.metricsGrid}>
        <MetricCard title="Velocity" value="32 pts" trend="+12%" icon={TrendingUp} color="#3b82f6" />
        <MetricCard title="Tasks Done" value="24/30" trend="80%" icon={CheckCircle} color="#10b981" />
        <MetricCard title="Critical Bugs" value="2" trend="-1" icon={AlertTriangle} color="#ef4444" />
        <MetricCard title="Deadline" value={project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"} trend="Hard" icon={Calendar} color="#8b5cf6" />
      </div>

      {/* CHARTS ROW */}
      <div style={styles.chartsGrid}>
        <motion.div style={styles.chartCard} whileHover={{ y: -5 }}>
          <h3 style={styles.cardTitle}>Sprint Burndown</h3>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={burndownData}>
                <defs>
                  <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:12}} />
                <Tooltip />
                <Area type="monotone" dataKey="remaining" stroke="#3b82f6" strokeWidth={3} fill="url(#colorR)" />
                <Area type="monotone" dataKey="ideal" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div style={styles.chartCard} whileHover={{ y: -5 }}>
          <h3 style={styles.cardTitle}>Task Distribution</h3>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={taskDistribution} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}

const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
  <div style={styles.metricCard}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
      <div>
        <div style={{color:'#64748b', fontSize:'13px', fontWeight:'600'}}>{title}</div>
        <div style={{fontSize:'24px', fontWeight:'800', color:'#1e293b', marginTop:'5px'}}>{value}</div>
      </div>
      <div style={{background:`${color}20`, padding:'10px', borderRadius:'10px'}}><Icon size={20} color={color} /></div>
    </div>
    <div style={{marginTop:'10px', fontSize:'12px', color:color, background:`${color}10`, display:'inline-block', padding:'4px 8px', borderRadius:'6px', fontWeight:'600'}}>{trend}</div>
  </div>
);

const styles = {
  container: { padding: '40px', height: '100vh', overflowY: 'auto', boxSizing: 'border-box' },
  topSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '5px' },
  
  // UPDATED TIMER STYLES
  timerContainer: {
    background: '#fff', padding: '15px 25px', borderRadius: '16px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0',
    display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '320px'
  },
  timerHeader: { 
    fontSize: '11px', color: '#ef4444', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px', 
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' 
  },
  timerGrid: { display: 'flex', alignItems: 'center', gap: '10px' },
  timeBlock: { textAlign: 'center', minWidth: '45px' },
  timeValue: { fontSize: '32px', fontWeight: '800', color: '#1e293b', lineHeight: '1' },
  timeLabel: { fontSize: '10px', color: '#94a3b8', fontWeight: '600', marginTop: '2px' },
  colon: { fontSize: '24px', fontWeight: '800', color: '#e2e8f0', marginBottom: '15px' },
  
  // INPUT STYLES
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' },
  dateInput: {
    padding: '10px', fontSize: '16px', borderRadius: '8px', border: '1px solid #e2e8f0',
    color: '#334155', width: '100%', outline: 'none', fontFamily: 'inherit'
  },

  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', marginBottom: '30px' },
  metricCard: { background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', paddingBottom: '50px' },
  chartCard: { background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  cardTitle: { margin: '0 0 20px 0', fontSize: '16px', color: '#334155', fontWeight:'700' }
};

export default Status;