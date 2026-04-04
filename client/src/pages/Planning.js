import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Calendar, CheckCircle, Circle, 
  Trash2, Clock, ListTodo, TrendingUp, AlertCircle 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function Planning({ projects, updateProject }) {
  const { id } = useParams();
  const project = projects.find(p => p.id === Number(id));
  const tasks = project?.planning?.tasks || [];
  const [newTask, setNewTask] = useState("");

  if (!project) return <div style={{padding:40, color: '#f8fafc', background: '#0f172a', height: '100vh'}}>Loading Data...</div>;

  // --- ACTIONS ---
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const taskItem = {
      id: Date.now(),
      title: newTask,
      status: "todo",
      priority: "medium",
      createdAt: new Date().toISOString()
    };
    updateProject(project.id, 'planning', { ...project.planning, tasks: [taskItem, ...tasks] });
    setNewTask("");
  };

  const toggleStatus = (taskId) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t);
    updateProject(project.id, 'planning', { ...project.planning, tasks: updatedTasks });
  };

  const deleteTask = (taskId) => {
    if(window.confirm("Remove task?")) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      updateProject(project.id, 'planning', { ...project.planning, tasks: updatedTasks });
    }
  };

  // --- DATA FOR CHARTS ---
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const todoCount = tasks.length - doneCount;
  
  const chartData = [
    { name: 'Completed', value: doneCount, color: '#10b981' },
    { name: 'Pending', value: todoCount, color: '#f5a524' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="module-wrapper">
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

        .add-form {
          display: flex;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 5px;
          width: 100%;
          max-width: 350px;
        }

        .add-input {
          border: none;
          background: transparent;
          color: #f8fafc;
          outline: none;
          flex: 1;
          padding: 10px 15px;
          font-size: 14px;
        }
        .add-input::placeholder { color: #64748b; }

        .add-btn {
          background: #38bdf8;
          color: #0f172a;
          border: none;
          border-radius: 8px;
          width: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .add-btn:hover { background: #0ea5e9; }

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
          padding: clamp(15px, 2vw, 25px);
          border-radius: 20px;
        }

        .panel-title {
          margin: 0 0 20px 0;
          font-size: 16px;
          color: #e2e8f0;
          font-weight: 700;
        }

        .task-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .task-title {
          font-weight: 600;
          color: #f1f5f9;
          font-size: 14px;
        }

        .task-meta { font-size: 11px; color: #64748b; margin-top: 4px; }
        
        .icon-btn { background: transparent; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: 0.2s;}
        .icon-btn:hover { transform: scale(1.1); }

        .summary-box {
          margin-top: 20px;
          padding: 20px;
          background: rgba(15, 23, 42, 0.4);
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* HEADER */}
      <div className="top-header">
        <div>
          <h1 className="page-title">Sprint Planning</h1>
          <p className="page-sub">{project.name} • Task Management</p>
        </div>
        <form onSubmit={addTask} className="add-form">
           <input 
              placeholder="Add narrative/task..." 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="add-input"
           />
           <button type="submit" className="add-btn"><Plus size={18}/></button>
        </form>
      </div>

      {/* METRICS ROW */}
      <div className="metrics-grid">
        <MetricCard title="Total Tasks" value={tasks.length} trend="Backlog" icon={ListTodo} color="#38bdf8" />
        <MetricCard title="Completed" value={doneCount} trend={`${tasks.length > 0 ? Math.round((doneCount/tasks.length)*100) : 0}%`} icon={CheckCircle} color="#10b981" />
        <MetricCard title="Pending" value={todoCount} trend="To Do" icon={Clock} color="#f5a524" />
        <MetricCard title="High Priority" value="0" trend="Critical" icon={AlertCircle} color="#ef4444" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="main-grid">
        
        {/* LEFT: TASK LIST */}
        <div className="panel-box">
          <h3 className="panel-title">Active Tasks</h3>
          <div className="task-list">
            {tasks.length === 0 ? (
               <div style={{textAlign:'center', padding:'40px', color:'#64748b'}}>No tasks yet. Deploy a new objective.</div>
            ) : (
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="task-item"
                    style={{ opacity: task.status === 'done' ? 0.5 : 1 }}
                  >
                    <div style={{display:'flex', alignItems:'center', gap:'15px', flex:1}}>
                      <button onClick={() => toggleStatus(task.id)} className="icon-btn">
                        {task.status === 'done' ? <CheckCircle size={22} color="#10b981" fill="rgba(16, 185, 129, 0.2)"/> : <Circle size={22} color="#64748b"/>}
                      </button>
                      <div style={{wordBreak: 'break-word', overflow:'hidden'}}>
                        <div className="task-title" style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                          {task.title}
                        </div>
                        <div className="task-meta">Added: {new Date(task.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="icon-btn" style={{color:'#ef4444'}}>
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* RIGHT: CHART */}
        <div className="panel-box">
          <h3 className="panel-title">Sprint Velocity</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={chartData} 
                  innerRadius={70} 
                  outerRadius={90} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc'}} itemStyle={{color: '#fff'}} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{color: '#94a3b8'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="summary-box">
             <div style={{fontSize:'28px', fontWeight:'900', color:'#38bdf8'}}>
               {tasks.length > 0 ? Math.round((doneCount/tasks.length)*100) : 0}%
             </div>
             <div style={{fontSize:'13px', color:'#94a3b8', fontWeight:'600'}}>COMPLETION RATE</div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// Reusable Metric Component
const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="metric-card">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
      <div>
        <div style={{color:'#94a3b8', fontSize:'13px', fontWeight:'600'}}>{title}</div>
        <div style={{fontSize:'28px', fontWeight:'900', color:'#f8fafc', marginTop:'5px'}}>{value}</div>
      </div>
      <div style={{background:`${color}20`, padding:'12px', borderRadius:'12px'}}><Icon size={22} color={color} /></div>
    </div>
    <div style={{marginTop:'auto', paddingTop:'15px'}}>
      <div style={{fontSize:'12px', color:color, background:`${color}15`, display:'inline-block', padding:'4px 10px', borderRadius:'20px', fontWeight:'700'}}>{trend}</div>
    </div>
  </div>
);

export default Planning;