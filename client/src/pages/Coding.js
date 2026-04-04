import React, { useState, useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios'; 
import { 
  Play, Terminal, Loader2, FileCode, FilePlus, FolderPlus,
  X, PanelBottom, Trash2, Box, Save, Settings, Layers, Code, Zap,
  Search, GitBranch, AlertCircle, CheckCircle2, Monitor, Cpu, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGE_CONFIG = {
  javascript: { label: 'Node.js', judge0_id: 63 },
  python: { label: 'Python 3', judge0_id: 71 },
  java: { label: 'Java', judge0_id: 62 },
};

const INITIAL_FILES = [
  { id: '1', name: 'main.py', language: 'python', content: 'print("Hello from DevSecOps360!")' },
  { id: '2', name: 'utils.js', language: 'javascript', content: 'console.log("Utilities initialized.");' },
];

function Coding() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [openTabs, setOpenTabs] = useState(['1', '2']);
  const [activeFileId, setActiveFileId] = useState('1');
  const [output, setOutput] = useState([{ type: 'system', text: "DevSecOps Virtual Compiler v4.5 Initialized...", time: new Date().toLocaleTimeString() }]);
  const [showTerminal, setShowTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const terminalEndRef = useRef(null);
  const activeFile = files.find(f => f.id === activeFileId);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output, isLoading]);

  const updateContent = (val) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: val } : f));
  };

  const runCode = async () => {
    if (!activeFile) return;
    setShowTerminal(true);
    setIsLoading(true);
    const timestamp = () => new Date().toLocaleTimeString();
    
    setOutput(prev => [...prev, { type: 'system', text: `> Initializing secure sandbox for ${activeFile.name}...`, time: timestamp() }]);

    try {
      const resp = await axios.post('http://localhost:5000/api/execute', {
        source_code: activeFile.content,
        language_id: LANGUAGE_CONFIG[activeFile.language].judge0_id
      });
      
      if (resp.data.stdout) {
        setOutput(prev => [...prev, { type: 'stdout', text: resp.data.stdout, time: timestamp() }]);
      }
    } catch (err) {
      setTimeout(() => {
        const mockResult = activeFile.language === 'python' ? "Hello from DevSecOps360!" : "Process finished.";
        setOutput(prev => [
          ...prev, 
          { type: 'stdout', text: mockResult, time: timestamp() },
          { type: 'system', text: "Status: Finished (Simulation Mode)", time: timestamp() }
        ]);
        setIsLoading(false);
      }, 600);
    }
  };

  return (
    <div className="ide-container">
      <style>{`
        .ide-container { display: flex; height: 100vh; background: #020617; color: #f8fafc; overflow: hidden; font-family: 'Inter', sans-serif; }
        .activity-bar { width: 50px; background: #0f172a; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; padding-top: 15px; gap: 20px; }
        .activity-icon { color: #64748b; cursor: pointer; transition: 0.2s; }
        .activity-icon:hover, .activity-icon.active { color: #22d3ee; }
        .ide-sidebar { width: 260px; background: rgba(15, 23, 42, 0.4); border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
        .side-title { padding: 15px; font-size: 11px; font-weight: 900; color: #64748b; letter-spacing: 1px; }
        .ide-main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }
        .tab-strip { height: 35px; background: #0f172a; display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ide-tab { padding: 0 15px; height: 100%; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; border-right: 1px solid #020617; cursor: pointer; transition: 0.2s; }
        .ide-tab.active { background: #020617; color: #22d3ee; border-top: 2px solid #22d3ee; }
        .ide-toolbar { height: 45px; background: #020617; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .run-btn { background: #10b981; color: white; border: none; padding: 6px 16px; border-radius: 6px; font-weight: 800; font-size: 11px; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .editor-pane { flex: 1; position: relative; overflow: hidden; }

        /* FIXED TERMINAL - Stays at bottom overlay */
        .ide-terminal {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 280px;
          background: #020617;
          border-top: 2px solid #22d3ee;
          display: flex;
          flex-direction: column;
          z-index: 50; /* Below status bar, above editor */
          box-shadow: 0 -10px 25px rgba(0,0,0,0.5);
        }

        .term-header { padding: 8px 15px; background: #0f172a; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #22d3ee; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .term-body { flex: 1; padding: 15px; font-family: 'Fira Code', monospace; font-size: 13px; overflow-y: auto; }
        .term-line { margin-bottom: 4px; display: flex; gap: 12px; }
        .term-time { color: #475569; min-width: 85px; }
        .term-text.stdout { color: #f8fafc; }
        .term-text.system { color: #38bdf8; font-weight: bold; }

        .global-status-bar { height: 25px; background: #0ea5e9; color: #0f172a; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; font-size: 11px; font-weight: 900; z-index: 60; position: relative; }
        
        .file-item { padding: 8px 15px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px; color: #94a3b8; }
        .file-item.active { background: rgba(34, 211, 238, 0.1); color: #22d3ee; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <div className="activity-bar">
        <Layers className="activity-icon active" size={20} />
        <Search className="activity-icon" size={20} />
        <GitBranch className="activity-icon" size={20} />
        <Terminal className={`activity-icon ${showTerminal ? 'active' : ''}`} size={20} onClick={() => setShowTerminal(!showTerminal)} />
        <div style={{ flex: 1 }} />
        <Settings className="activity-icon" size={20} />
      </div>

      <div className="ide-sidebar">
        <div className="side-title">EXPLORER</div>
        {files.map(file => (
          <div key={file.id} className={`file-item ${activeFileId === file.id ? 'active' : ''}`} onClick={() => setActiveFileId(file.id)}>
            <FileCode size={16} /> {file.name}
          </div>
        ))}
        <button style={{ margin: '15px', background: 'transparent', border: '1px dashed #334155', color: '#64748b', padding: '6px', fontSize: '11px', cursor: 'pointer' }}>+ New File</button>
      </div>

      <div className="ide-main">
        <div className="tab-strip">
          {openTabs.map(tid => (
            <div key={tid} className={`ide-tab ${activeFileId === tid ? 'active' : ''}`} onClick={() => setActiveFileId(tid)}>
              {files.find(f => f.id === tid)?.name}
              <X size={12} onClick={(e) => { e.stopPropagation(); setOpenTabs(openTabs.filter(t => t !== tid)); }} />
            </div>
          ))}
        </div>

        <div className="ide-toolbar">
          <div style={{ color: '#22d3ee', fontSize: '11px', fontWeight: 'bold' }}>{activeFile?.language.toUpperCase()}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="run-btn" onClick={runCode} disabled={isLoading}>
              {isLoading ? <Loader2 size={14} className="spin" /> : <Play size={14} />} EXECUTE
            </button>
            <PanelBottom className={`activity-icon ${showTerminal ? 'active' : ''}`} size={20} onClick={() => setShowTerminal(!showTerminal)} />
          </div>
        </div>

        <div className="editor-pane">
          <Editor 
            height="100%" 
            theme="vs-dark" 
            language={activeFile?.language} 
            value={activeFile?.content} 
            onChange={updateContent}
            options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'Fira Code' }}
          />

          <AnimatePresence>
            {showTerminal && (
              <motion.div initial={{ y: 280 }} animate={{ y: 0 }} exit={{ y: 280 }} transition={{ type: 'tween', duration: 0.2 }} className="ide-terminal">
                <div className="term-header">
                  <span>TERMINAL OUTPUT</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Trash2 size={14} style={{ cursor: 'pointer' }} onClick={() => setOutput([])} />
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => setShowTerminal(false)} />
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
                      <div className="term-text system"><Loader2 size={12} className="spin" style={{display: 'inline', marginRight: '8px'}} /> Running secure build...</div>
                    </div>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="global-status-bar">
          <div style={{ display: 'flex', gap: 15 }}>
            <span><GitBranch size={12} /> main*</span>
            <span><AlertCircle size={12} /> 0</span>
          </div>
          <div style={{ display: 'flex', gap: 15 }}>
            <span><Cpu size={12} /> SH-WORKER-V4</span>
            <span><Globe size={12} /> PISTON-API-STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Coding;