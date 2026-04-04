import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { 
  Database as DbIcon, Play, Table, Search, 
  Server, RefreshCw, Plus, Trash2, Save, Terminal
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
      
      let data = [];
      if (q.includes("users")) data = MOCK_DB.users;
      else if (q.includes("projects")) data = MOCK_DB.projects;
      else if (q.includes("logs")) data = MOCK_DB.logs;
      else data = [{ error: "Syntax Error: Table '"+q.split('from')[1]?.trim().split(' ')[0]+"' not found in namespace." }];

      setResults(data);
      setHistory(prev => [{ query: query, time: new Date().toLocaleTimeString(), status: "success" }, ...prev]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="database-wrapper">
      <style>{`
        .database-wrapper {
          display: flex;
          height: 100vh;
          background: #020617;
          color: #f8fafc;
          overflow: hidden;
          font-family: sans-serif;
        }

        .db-sidebar {
          width: 250px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
          border-right: 1px solid #1e293b;
          display: flex;
          flex-direction: column;
        }

        .conn-header {
          padding: 20px;
          border-bottom: 1px solid #1e293b;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(15, 23, 42, 0.5);
        }

        .section-title { font-size: 11px; font-weight: 800; color: #475569; padding: 25px 20px 10px 20px; letter-spacing: 1.5px; }

        .table-item {
          padding: 10px 20px;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #94a3b8;
          transition: 0.2s;
          border-left: 3px solid transparent;
        }
        .table-item:hover { color: #f8fafc; background: rgba(255,255,255,0.03); }
        .table-item.active { color: #38bdf8; background: rgba(56, 189, 248, 0.05); border-left-color: #38bdf8; font-weight: 700; }

        .history-pane { flex: 1; overflow-y: auto; border-top: 1px solid #1e293b; }
        .hist-item { padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.02); }

        .db-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

        .db-toolbar {
          height: 60px;
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 25px;
        }

        .run-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.2s;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        .run-btn:hover { background: #059669; transform: translateY(-1px); }

        .editor-pane { height: 350px; background: #020617; border-bottom: 1px solid #1e293b; padding: 10px; }

        .results-pane { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .results-header { padding: 15px 25px; background: #0f172a; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; font-weight: 800; color: #64748b; font-size: 12px; }

        .table-scroll { flex: 1; overflow: auto; background: #020617; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
        .data-table th { background: #0f172a; padding: 15px 20px; color: #94a3b8; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #1e293b; position: sticky; top: 0; }
        .data-table td { padding: 15px 20px; color: #cbd5e1; border-bottom: 1px solid rgba(255,255,255,0.02); }
        .data-table tr:hover { background: rgba(56, 189, 248, 0.02); }

        .icon-btn { background: transparent; border: none; color: #475569; cursor: pointer; padding: 8px; border-radius: 8px; transition: 0.2s; }
        .icon-btn:hover { color: #f8fafc; background: rgba(255,255,255,0.05); }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
      
      {/* SIDEBAR */}
      <div className="db-sidebar">
        <div className="conn-header">
          <Server size={20} color="#10b981" />
          <div style={{display:'flex', flexDirection:'column'}}>
            <span style={{fontSize:'13px', fontWeight:'900', letterSpacing:'0.5px'}}>NODE_CLUSTER_01</span>
            <span style={{fontSize:'10px', color: '#10b981', fontWeight:'800'}}>CONNECTED · PG_15</span>
          </div>
        </div>

        <div className="section-title">ACTIVE SCHEMAS</div>
        <div style={{flex: 1}}>
          {Object.keys(MOCK_DB).map(table => (
            <div 
              key={table} 
              className={`table-item ${activeTable === table ? 'active' : ''}`}
              onClick={() => {
                setActiveTable(table);
                setQuery(`SELECT * FROM ${table};`);
                setResults(MOCK_DB[table]);
              }}
            >
              <Table size={16} /> {table.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="section-title">EXECUTION LOG</div>
        <div className="history-pane">
          {history.map((h, i) => (
            <div key={i} className="hist-item">
              <div style={{color:'#475569', fontSize:'10px', fontWeight:'800'}}>{h.time}</div>
              <div style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontSize:'11px', color:'#94a3b8', fontFamily:'monospace'}}>{h.query}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN VIEW */}
      <div className="db-main">
        
        <div className="db-toolbar">
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
             <DbIcon size={20} color="#38bdf8"/>
             <span style={{fontWeight:'900', letterSpacing:'1px', fontSize:'14px'}}>SQL COMMAND CONSOLE</span>
          </div>
          <div style={{display:'flex', gap:'12px'}}>
             <button onClick={() => setQuery('')} className="icon-btn" title="Clear Editor"><Trash2 size={18}/></button>
             <button className="icon-btn" title="Save Query"><Save size={18}/></button>
             <button onClick={runQuery} className="run-btn">
               {loading ? <RefreshCw className="spin" size={16}/> : <Play size={16}/>} EXECUTE
             </button>
          </div>
        </div>

        <div className="editor-pane">
          <Editor 
            height="100%" 
            theme="vs-dark" 
            defaultLanguage="sql"
            value={query}
            onChange={(val) => setQuery(val)}
            options={{ 
              minimap: { enabled: false }, 
              fontSize: 15, 
              fontFamily: '"Fira Code", monospace',
              lineNumbers: 'on',
              padding: { top: 20 },
              backgroundColor: 'transparent'
            }}
          />
        </div>

        <div className="results-pane">
          <div className="results-header">
            <span>QUERY RESULTS</span>
            <span style={{color:'#38bdf8'}}>{results ? `${results.length} ROWS RETURNED` : '0 ROWS'}</span>
          </div>
          
          <div className="table-scroll">
            {results && results.length > 0 && !results[0].error ? (
              <table className="data-table">
                <thead>
                  <tr>
                    {Object.keys(results[0]).map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i}>
                       {Object.values(row).map((val, j) => (
                         <td key={j}>{val}</td>
                       ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{padding:'60px', textAlign:'center'}}>
                {results && results[0]?.error ? (
                  <div style={{color:'#ef4444', fontWeight:'800', display:'flex', flexDirection:'column', alignItems:'center', gap:'15px'}}>
                    <Terminal size={48} opacity={0.2} />
                    {results[0].error}
                  </div>
                ) : (
                  <div style={{color:'#334155', display:'flex', flexDirection:'column', alignItems:'center', gap:'15px'}}>
                    <Search size={48} opacity={0.2} />
                    Ready for Query Input...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Database;