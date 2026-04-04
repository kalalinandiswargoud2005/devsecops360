import React, { useState, useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios'; 
import { 
  Play, Terminal, Loader2, 
  FileCode, 
  FilePlus, FolderPlus,
  X, PanelBottom, Trash2, Box, Save, Settings, Layers, Code, Zap,
  Search, GitBranch, AlertCircle, CheckCircle2, Monitor, Cpu, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGE_CONFIG = {
  javascript: { label: 'Node.js', judge0_id: 63 },
  python: { label: 'Python 3', judge0_id: 71 },
  java: { label: 'Java', judge0_id: 62 },
  c: { label: 'C', judge0_id: 50 },
  cpp: { label: 'C++', judge0_id: 54 },
};

const INITIAL_FILES = [
  { id: '1', name: 'main.py', isFolder: false, language: 'python', content: 'print("Hello from DevSecOps360!")' },
  { id: '2', name: 'utils.js', isFolder: false, language: 'javascript', content: 'console.log("Utilities initialized.");' },
];

function Coding() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [openTabs, setOpenTabs] = useState(['1', '2']);
  const [activeFileId, setActiveFileId] = useState('1');
  const [output, setOutput] = useState([{ type: 'system', text: "DevSecOps Virtual Compiler v4.5 Initialized...", time: new Date().toLocaleTimeString() }]);
  const [showTerminal, setShowTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeActivity, setActiveActivity] = useState('explorer');
  
  const terminalEndRef = useRef(null);
  const activeFile = files.find(f => f.id === activeFileId);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output, isLoading]);

  const openFile = (id) => {
    if (!openTabs.includes(id)) setOpenTabs([...openTabs, id]);
    setActiveFileId(id);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tid => tid !== id);
    setOpenTabs(newTabs);
    if (activeFileId === id) setActiveFileId(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
  };

  const createNewFile = () => {
    const name = prompt("Enter Filename:");
    if (!name) return;
    const newFile = { id: Date.now().toString(), name, isFolder: false, language: 'python', content: '' };
    setFiles([...files, newFile]);
    openFile(newFile.id);
  };

  const runCode = async () => {
    if (!activeFile) return;
    setShowTerminal(true);
    setIsLoading(true);
    
    const timestamp = () => new Date().toLocaleTimeString();
    setOutput(prev => [...prev, { type: 'system', text: `> Initializing secure sandbox for ${activeFile.name}...`, time: timestamp() }]);

    try {
      // Restore Proxy Execution
      const resp = await axios.post('http://localhost:5000/api/execute', {
        source_code: activeFile.content,
        language_id: LANGUAGE_CONFIG[activeFile.language]?.judge0_id || 71
      });

      const { stdout, stderr, compile_output, message, status } = resp.data;
      
      if (stdout) {
        setOutput(prev => [...prev, ...stdout.split('\n').filter(l => l).map(l => ({ type: 'stdout', text: l, time: timestamp() }))]);
      }
      if (stderr || compile_output) {
        const errorText = stderr || compile_output;
        setOutput(prev => [...prev, ...errorText.split('\n').filter(l => l).map(l => ({ type: 'stderr', text: l, time: timestamp() }))]);
      }
      if (message) {
        setOutput(prev => [...prev, { type: 'system', text: `Msg: ${message}`, time: timestamp() }]);
      }
      
      setOutput(prev => [...prev, { type: 'system', text: `Status: ${status?.description || 'Finished'}`, time: timestamp() }]);
    } catch (err) {
      const errorMsg = err.response?.status === 401 ? "Unauthorized: Compiler API restricted." : 
                       err.response?.status === 429 ? "Rate Limit: Exhausted compiler nodes." :
                       "Fatal: Sandbox connection failure.";
      setOutput(prev => [...prev, { type: 'error', text: errorMsg, time: timestamp() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ide-container">
      <style>{`
        .ide-container { display: flex; height: 100vh; background: #020617; color: #f8fafc; overflow: hidden; }
        
        /* Layout */
        .activity-bar { width: 50px; background: #0f172a; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; padding-top: 15px; gap: 15px; }
        .activity-icon { color: #64748b; cursor: pointer; padding: 8px; border-radius: 8px; }
        .activity-icon.active { color: #22d3ee; background: rgba(34, 211, 238, 0.05); }

        .ide-sidebar { width: 260px; background: rgba(15, 23, 42, 0.4); border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
        .ide-main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }

        /* Tabs & Toolbar */
        .tab-strip { height: 35px; background: #0f172a; display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ide-tab { padding: 0 15px; height: 100%; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; border-right: 1px solid #020617; cursor: pointer; }
        .ide-tab.active { background: #020617; color: #22d3ee; border-top: 2px solid #22d3ee; }

        .ide-toolbar { height: 45px; background: #020617; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .run-btn { background: #10b981; color: white; border: none; padding: 6px 16px; border-radius: 6px; font-weight: 800; font-size: 11px; display: flex; align-items: center; gap: 8px; cursor: pointer; }

        /* Editor Area */
        .editor-pane { flex: 1; position: relative; overflow: hidden; }

        /* FIXED TERMINAL (Absolute Positioning) */
        .ide-terminal {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 280px;
          background: #0f172a;
          border-top: 2px solid #22d3ee;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.5);
        }

        .term-header { padding: 8px 15px; background: #020617; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #22d3ee; font-weight: bold; }
        .term-body { flex: 1; padding: 15px; font-family: 'Fira Code', monospace; font-size: 13px; overflow-y: auto; background: #020617; }
        .term-line { margin-bottom: 6px; display: flex; gap: 15px; }
        .term-time { color: #475569; }
        .term-text.stdout { color: #f8fafc; }
        .term-text.system { color: #38bdf8; }

        .global-status-bar { height: 25px; background: #0ea5e9; color: #0f172a; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; font-size: 11px; font-weight: 900; }
        
        .file-item { padding: 8px 15px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px; color: #94a3b8; }
        .file-item.active { background: rgba(34, 211, 238, 0.1); color: #22d3ee; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {/* Activity Bar */}
      <div className="activity-bar">
        <Layers className={`activity-icon ${activeActivity === 'explorer' ? 'active' : ''}`} onClick={() => setActiveActivity('explorer')} />
        <Search className="activity-icon" />
        <GitBranch className="activity-icon" />
        <Terminal className={`activity-icon ${showTerminal ? 'active' : ''}`} onClick={() => setShowTerminal(!showTerminal)} />
        <div style={{ flex: 1 }} />
        <Settings className="activity-icon" />
      </div>

      {/* Sidebar */}
      <div className="ide-sidebar">
        <div style={{ padding: '15px', fontSize: '11px', fontWeight: '900', color: '#64748b' }}>EXPLORER</div>
        {files.map(file => (
          <div key={file.id} className={`file-item ${activeFileId === file.id ? 'active' : ''}`} onClick={() => openFile(file.id)}>
            <FileCode size={16} /> {file.name}
          </div>
        ))}
        <button onClick={createNewFile} style={{ margin: '10px', background: 'transparent', border: '1px dashed #334155', color: '#64748b', padding: '5px', cursor: 'pointer' }}>+ New File</button>
      </div>

      {/* Main IDE */}
      <div className="ide-main">
        <div className="tab-strip">
          {openTabs.map(tid => (
            <div key={tid} className={`ide-tab ${activeFileId === tid ? 'active' : ''}`} onClick={() => setActiveFileId(tid)}>
              {files.find(f => f.id === tid)?.name}
              <X size={12} onClick={(e) => closeTab(e, tid)} />
            </div>
          ))}
        </div>

        <div className="ide-toolbar">
          <div className="lang-badge" style={{ color: '#22d3ee', fontSize: '11px' }}>{activeFile?.language.toUpperCase()}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="run-btn" onClick={runCode} disabled={isLoading}>
              {isLoading ? <Loader2 size={14} className="spin" /> : <Play size={14} />} EXECUTE
            </button>
            <button onClick={() => setShowTerminal(!showTerminal)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <PanelBottom size={20} color={showTerminal ? '#22d3ee' : '#64748b'} />
            </button>
          </div>
        </div>

        <div className="editor-pane">
          <Editor 
            height="100%" 
            theme="vs-dark" 
            language={activeFile?.language} 
            value={activeFile?.content} 
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />

          {/* TERMINAL OVERLAY */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div 
                initial={{ y: 300 }} 
                animate={{ y: 0 }} 
                exit={{ y: 300 }} 
                transition={{ type: 'tween' }}
                className="ide-terminal"
              >
                <div className="term-header">
                  <span>TERMINAL OUTPUT</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Trash2 size={14} onClick={() => setOutput([])} style={{ cursor: 'pointer' }} />
                    <X size={14} onClick={() => setShowTerminal(false)} style={{ cursor: 'pointer' }} />
                  </div>
                </div>
                <div className="term-body">
                  {output.map((log, i) => (
                    <div key={i} className="term-line">
                      <span className="term-time">[{log.time}]</span>
                      <div className={`term-text ${log.type}`}>{log.text}</div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="term-line">
                      <span className="term-time">[{new Date().toLocaleTimeString()}]</span>
                      <div className="term-text system">Running secure build process...</div>
                    </div>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="global-status-bar">
          <div><GitBranch size={12} /> main*</div>
          <div><Cpu size={12} /> SH-WORKER-V4 <Globe size={12} /> PISTON-API-STABLE</div>
        </div>
      </div>
    </div>
  );
}

export default Coding;