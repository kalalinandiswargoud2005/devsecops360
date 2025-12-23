import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { 
  Database as DbIcon, Play, Table, Search, 
  Server, RefreshCw, Plus, Trash2, Save 
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- MOCK DATABASE DATA ---
const MOCK_DB = {
  users: [
    { id: 1, username: "admin", role: "admin", created_at: "2023-01-01" },
    { id: 2, username: "dev_lead", role: "developer", created_at: "2023-02-15" },
    { id: 3, username: "qa_tester", role: "tester", created_at: "2023-03-10" },
    { id: 4, username: "manager", role: "manager", created_at: "2023-04-05" }
  ],
  projects: [
    { id: 101, name: "Neo-Bank", status: "active", budget: 50000 },
    { id: 102, name: "E-Commerce", status: "planning", budget: 12000 },
    { id: 103, name: "Internal_Tool", status: "maintenance", budget: 5000 }
  ],
  logs: [
    { id: 9001, event: "LOGIN_SUCCESS", user_id: 1, ip: "192.168.1.1" },
    { id: 9002, event: "QUERY_EXEC", user_id: 2, ip: "192.168.1.5" },
    { id: 9003, event: "LOGOUT", user_id: 1, ip: "192.168.1.1" }
  ]
};

function Database() {
  const [query, setQuery] = useState("SELECT * FROM users;");
  const [results, setResults] = useState(MOCK_DB.users);
  const [activeTable, setActiveTable] = useState('users');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // --- MOCK QUERY ENGINE ---
  const runQuery = () => {
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      const q = query.trim().toLowerCase();
      
      // Simple Parser Logic for Demo
      let data = [];
      if (q.includes("users")) data = MOCK_DB.users;
      else if (q.includes("projects")) data = MOCK_DB.projects;
      else if (q.includes("logs")) data = MOCK_DB.logs;
      else data = [{ error: "Syntax Error or Table Not Found" }];

      setResults(data);
      setHistory(prev => [{ query: query, time: new Date().toLocaleTimeString(), status: "success" }, ...prev]);
      setLoading(false);
    }, 600);
  };

  return (
    <div style={styles.container}>
      
      {/* 1. SIDEBAR: CONNECTION & SCHEMA */}
      <div style={styles.sidebar}>
        <div style={styles.connectionHeader}>
          <Server size={16} color="#4ade80" />
          <div style={{display:'flex', flexDirection:'column'}}>
            <span style={{fontSize:'12px', fontWeight:'bold'}}>localhost:5432</span>
            <span style={{fontSize:'10px', color:'#94a3b8'}}>PostgreSQL 15</span>
          </div>
        </div>

        <div style={styles.sectionTitle}>TABLES (public)</div>
        <div style={styles.tableList}>
          {Object.keys(MOCK_DB).map(table => (
            <div 
              key={table} 
              style={{...styles.tableItem, background: activeTable === table ? '#334155' : 'transparent'}}
              onClick={() => {
                setActiveTable(table);
                setQuery(`SELECT * FROM ${table};`);
                setResults(MOCK_DB[table]);
              }}
            >
              <Table size={14} color="#38bdf8" /> {table}
            </div>
          ))}
        </div>

        <div style={styles.sectionTitle}>QUERY HISTORY</div>
        <div style={styles.historyList}>
          {history.map((h, i) => (
            <div key={i} style={styles.historyItem}>
              <span style={{color:'#94a3b8', fontSize:'10px'}}>{h.time}</span>
              <div style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontSize:'11px'}}>{h.query}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN AREA */}
      <div style={styles.main}>
        
        {/* TOOLBAR */}
        <div style={styles.toolbar}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
             <DbIcon size={18} color="#38bdf8"/>
             <span style={{fontWeight:'bold'}}>SQL Editor</span>
          </div>
          <div style={{display:'flex', gap:'10px'}}>
             <button onClick={() => setQuery('')} style={styles.iconBtn} title="Clear"><Trash2 size={16}/></button>
             <button style={styles.iconBtn} title="Save Query"><Save size={16}/></button>
             <button onClick={runQuery} style={styles.runBtn}>
               {loading ? <RefreshCw className="spin" size={14}/> : <Play size={14}/>} Run
             </button>
          </div>
        </div>

        {/* EDITOR */}
        <div style={styles.editorContainer}>
          <Editor 
            height="100%" 
            theme="vs-dark" 
            defaultLanguage="sql"
            value={query}
            onChange={(val) => setQuery(val)}
            options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on' }}
          />
        </div>

        {/* RESULTS GRID */}
        <div style={styles.resultsContainer}>
          <div style={styles.resultsHeader}>
            <span>Query Results</span>
            <span style={{fontSize:'11px', color:'#94a3b8'}}>{results ? `${results.length} rows` : '0 rows'}</span>
          </div>
          
          <div style={styles.tableWrapper}>
            {results && results.length > 0 && !results[0].error ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    {Object.keys(results[0]).map(key => (
                      <th key={key} style={styles.th}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i} style={styles.tr}>
                       {Object.values(row).map((val, j) => (
                         <td key={j} style={styles.td}>{val}</td>
                       ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.emptyState}>
                {results && results[0]?.error ? (
                  <span style={{color:'#ef4444'}}>❌ {results[0].error}</span>
                ) : (
                  "Run a query to see results"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', background: '#0f172a', color: '#e2e8f0' },
  sidebar: { width: '220px', background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' },
  connectionHeader: { padding: '15px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a' },
  sectionTitle: { fontSize: '10px', fontWeight: 'bold', color: '#64748b', padding: '15px 15px 5px 15px', marginTop: '10px' },
  tableList: { flex: 1 },
  tableItem: { padding: '8px 15px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' },
  historyList: { height: '150px', overflowY: 'auto', borderTop: '1px solid #334155' },
  historyItem: { padding: '8px 15px', borderBottom: '1px solid #33415530' },
  
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  toolbar: { height: '50px', background: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  runBtn: { background: '#10b981', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  iconBtn: { background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '5px' },
  
  editorContainer: { height: '40%', borderBottom: '1px solid #334155' },
  
  resultsContainer: { flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a' },
  resultsHeader: { padding: '10px 20px', background: '#1e293b', borderBottom: '1px solid #334155', fontSize: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' },
  tableWrapper: { flex: 1, overflow: 'auto', padding: '0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' },
  th: { background: '#334155', padding: '10px 15px', color: '#e2e8f0', position: 'sticky', top: 0 },
  tr: { borderBottom: '1px solid #1e293b' },
  td: { padding: '8px 15px', color: '#94a3b8' },
  emptyState: { padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default Database;