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

  if (!project) return <div style={{padding:40}}>Loading...</div>;

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
    { name: 'Pending', value: todoCount, color: '#f59e0b' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.topSection}>
        <div>
          <h1 style={styles.title}>Sprint Planning</h1>
          <p style={styles.subtitle}>{project.name} • Task Management</p>
        </div>
        <div style={styles.addButtonContainer}>
          <form onSubmit={addTask} style={styles.inputWrapper}>
             <input 
                placeholder="Add new task..." 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                style={styles.input}
             />
             <button type="submit" style={styles.addBtn}><Plus size={18}/></button>
          </form>
        </div>
      </div>

      {/* METRICS ROW */}
      <div style={styles.metricsGrid}>
        <MetricCard title="Total Tasks" value={tasks.length} trend="Backlog" icon={ListTodo} color="#3b82f6" />
        <MetricCard title="Completed" value={doneCount} trend={`${tasks.length > 0 ? Math.round((doneCount/tasks.length)*100) : 0}%`} icon={CheckCircle} color="#10b981" />
        <MetricCard title="Pending" value={todoCount} trend="To Do" icon={Clock} color="#f59e0b" />
        <MetricCard title="High Priority" value="0" trend="Critical" icon={AlertCircle} color="#ef4444" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={styles.contentGrid}>
        
        {/* LEFT: TASK LIST */}
        <div style={styles.listSection}>
          <h3 style={styles.sectionTitle}>Active Tasks</h3>
          <div style={styles.taskList}>
            {tasks.length === 0 ? (
               <div style={styles.emptyState}>No tasks yet. Add one above!</div>
            ) : (
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      ...styles.taskCard,
                      opacity: task.status === 'done' ? 0.6 : 1
                    }}
                  >
                    <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                      <button onClick={() => toggleStatus(task.id)} style={styles.iconBtn}>
                        {task.status === 'done' ? <CheckCircle size={22} color="#10b981" fill="#10b981" fillOpacity={0.2}/> : <Circle size={22} color="#94a3b8"/>}
                      </button>
                      <div>
                        <div style={{
                          ...styles.taskTitle, 
                          textDecoration: task.status === 'done' ? 'line-through' : 'none'
                        }}>{task.title}</div>
                        <div style={styles.taskMeta}>Added: {new Date(task.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(task.id)} style={{...styles.iconBtn, color:'#ef4444'}}>
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* RIGHT: CHART */}
        <div style={styles.chartSection}>
          <h3 style={styles.sectionTitle}>Sprint Progress</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={chartData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none"/>
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={styles.summaryBox}>
            <div style={{textAlign:'center'}}>
               <div style={{fontSize:'24px', fontWeight:'800', color:'#1e293b'}}>
                 {tasks.length > 0 ? Math.round((doneCount/tasks.length)*100) : 0}%
               </div>
               <div style={{fontSize:'12px', color:'#64748b'}}>Completion Rate</div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// Reusable Metric Component (Same as Status.js)
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
  container: { padding: '40px', height: '100vh', overflowY: 'auto', boxSizing: 'border-box', background: '#f8fafc' },
  topSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 },
  subtitle: { color: '#64748b', marginTop: '5px' },
  
  addButtonContainer: { width: '300px' },
  inputWrapper: { display: 'flex', background: 'white', borderRadius: '12px', padding: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  input: { border: 'none', outline: 'none', flex: 1, padding: '10px 15px', fontSize: '14px', borderRadius: '12px' },
  addBtn: { background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', width: '40px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' },

  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', marginBottom: '30px' },
  metricCard: { background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },

  contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px' },
  listSection: { background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  chartSection: { background: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display:'flex', flexDirection:'column', alignItems:'center' },
  
  sectionTitle: { margin: '0 0 20px 0', fontSize: '16px', color: '#334155', fontWeight: '700' },
  taskList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  taskCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#f8fafc' },
  taskTitle: { fontWeight: '600', color: '#334155', fontSize: '14px' },
  taskMeta: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' },
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' },
  emptyState: { textAlign:'center', padding:'40px', color:'#94a3b8', fontSize:'14px' },
  
  summaryBox: { marginTop:'20px', padding:'20px', width:'100%', background:'#f8fafc', borderRadius:'12px', display:'flex', justifyContent:'center' }
};

export default Planning;