import React, { useState, useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios'; 
import { 
  Play, Terminal, Loader2, 
  Folder, FolderOpen, FileCode, File, 
  ChevronRight, ChevronDown, FilePlus, FolderPlus,
  X, PanelBottom, Trash2, UploadCloud, Box, Save, Settings, Layers, Code, Zap,
  Search, GitBranch, AlertCircle, CheckCircle2, Monitor, Cpu, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------------- CONFIG: LANGUAGE VERSIONS ---------------- */
const LANGUAGE_CONFIG = {
  javascript: { label: 'Node.js', version: '18.15.0', icon: 'js' },
  python: { label: 'Python 3', version: '3.10.0', icon: 'py' },
  java: { label: 'Java', version: '15.0.2', icon: 'java' },
  c: { label: 'C', version: '10.2.0', icon: 'c' },
  cpp: { label: 'C++', version: '10.2.0', icon: 'cpp' },
  go: { label: 'Go', version: '1.16.2', icon: 'go' },
  rust: { label: 'Rust', version: '1.68.2', icon: 'rs' },
  typescript: { label: 'TypeScript', version: '5.0.3', icon: 'ts' },
  php: { label: 'PHP', version: '8.2.3', icon: 'php' },
};

/* ---------------- INITIAL STATE ---------------- */
const INITIAL_FILES = [
  { id: '1', name: 'main.py', isFolder: false, language: 'python', content: 'print("Hello from DevSecOps360!")\n# Run me to see the output below' },
  { id: '2', name: 'utils.js', isFolder: false, language: 'javascript', content: 'console.log("Utilities initialized.");' },
];

function Coding() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [openTabs, setOpenTabs] = useState(['1', '2']);
  const [activeFileId, setActiveFileId] = useState('1');
  const [output, setOutput] = useState([{ type: 'system', text: "DevSecOps Virtual Compiler v4.5 Initialized...", time: new Date().toLocaleTimeString() }]);
  const [showTerminal, setShowTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [activeActivity, setActiveActivity] = useState('explorer');
  
  const activeFile = files.find(f => f.id === activeFileId);

  /* ---------------- HELPERS ---------------- */
  const getLanguageFromExt = (name) => {
    const ext = name.split('.').pop();
    const map = {
      js: 'javascript', py: 'python', java: 'java', c: 'c', cpp: 'cpp', 
      go: 'go', rs: 'rust', ts: 'typescript', php: 'php', html: 'html', css: 'css'
    };
    return map[ext] || 'plaintext';
  };

  /* ---------------- ACTIONS ---------------- */
  const openFile = (id) => {
    if (!openTabs.includes(id)) setOpenTabs([...openTabs, id]);
    setActiveFileId(id);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(tid => tid !== id);
    setOpenTabs(newTabs);
    if (activeFileId === id) {
      setActiveFileId(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  const createNewFile = () => {
    const name = prompt("Enter Filename (e.g. app.py):");
    if (!name) return;
    const newFile = {
      id: Date.now().toString(),
      name,
      isFolder: false,
      language: getLanguageFromExt(name),
      content: ''
    };
    setFiles([...files, newFile]);
    openFile(newFile.id);
  };

  const deleteFile = (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Permanent deletion?")) return;
    setFiles(files.filter(f => f.id !== id));
    closeTab(e, id);
  };

  const updateContent = (val) => {
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: val } : f));
  };

  /* ---------------- EXECUTION ---------------- */
  const runCode = async () => {
    if (!activeFile) return;
    setShowTerminal(true);
    setIsLoading(true);
    
    const timestamp = () => new Date().toLocaleTimeString();
    setOutput(prev => [...prev, { type: 'system', text: `> Starting execution: ${activeFile.name}`, time: timestamp() }]);

    const config = LANGUAGE_CONFIG[activeFile.language];
    if (!config) {
      setOutput(prev => [...prev, { type: 'error', text: `Error: Runtime environment for .${activeFile.language} not available.`, time: timestamp() }]);
      setIsLoading(false);
      return;
    }

    try {
      const resp = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: activeFile.language,
        version: config.version,
        files: [{ name: activeFile.name, content: activeFile.content }]
      });

      const { run } = resp.data;
      if (run.stdout) setOutput(prev => [...prev, ...run.stdout.split('\n').filter(l => l).map(l => ({ type: 'stdout', text: l, time: timestamp() }))]);
      if (run.stderr) setOutput(prev => [...prev, ...run.stderr.split('\n').filter(l => l).map(l => ({ type: 'stderr', text: l, time: timestamp() }))]);
      
      setOutput(prev => [...prev, { type: 'system', text: `Process completed (code ${run.code})`, time: timestamp() }]);
    } catch (err) {
      setOutput(prev => [...prev, { type: 'error', text: "Fatal: Handshake with execution shard failed.", time: timestamp() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ide-container">
      <style>{`
        .ide-container {
          display: flex;
          height: 100vh;
          background: #020617;
          color: #f8fafc;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* ACTIVITY BAR */
        .activity-bar {
          width: 50px;
          background: #0f172a;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 15px;
          gap: 10px;
          z-index: 100;
        }
        .activity-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          border-radius: 8px;
          transition: 0.2s;
          position: relative;
        }
        .activity-icon:hover { color: #f8fafc; background: rgba(255,255,255,0.03); }
        .activity-icon.active { color: #22d3ee; }
        .activity-icon.active::before {
          content: ''; position: absolute; left: -2px; top: 15%; bottom: 15%; width: 2px; background: #22d3ee; box-shadow: 0 0 10px #22d3ee;
        }

        /* SIDEBAR */
        .ide-sidebar {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .side-header {
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          background: rgba(2, 6, 23, 0.2);
        }
        .side-title { font-size: 11px; font-weight: 900; color: #64748b; letter-spacing: 2px; text-transform: uppercase; }

        .file-list { flex: 1; overflow-y: auto; padding: 10px; }
        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          color: #94a3b8;
          transition: background 0.2s, color 0.2s;
          margin-bottom: 2px;
        }
        .file-item:hover { background: rgba(255, 255, 255, 0.03); color: #f8fafc; }
        .file-item.active { background: rgba(34, 211, 238, 0.08); color: #22d3ee; font-weight: 700; }

        .delete-icon { opacity: 0; color: #ef4444; transition: opacity 0.2s; }
        .file-item:hover .delete-icon { opacity: 1; }

        /* MAIN IDE AREA */
        .ide-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        /* TABS */
        .tab-strip {
          height: 35px;
          background: #0f172a;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          overflow-x: auto;
          overflow-y: hidden;
        }
        .tab-strip::-webkit-scrollbar { height: 0; }

        .ide-tab {
          height: 100%;
          padding: 0 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          border-right: 1px solid rgba(2, 6, 23, 0.5);
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          position: relative;
          min-width: 100px;
        }
        .ide-tab:hover { background: rgba(255, 255, 255, 0.02); color: #f8fafc; }
        .ide-tab.active { 
          background: #020617; 
          color: #22d3ee; 
          font-weight: 700;
        }
        .ide-tab.active::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: #22d3ee;
          box-shadow: 0 0 10px #22d3ee;
        }

        /* TOOLBAR */
        .ide-toolbar {
          height: 45px;
          background: #020617;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .run-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 6px 16px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
        }
        .run-btn:hover:not(:disabled) { background: #059669; box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); transform: translateY(-1px); }
        .run-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* EDITOR PANE */
        .editor-pane { flex: 1; position: relative; display: flex; flex-direction: column; }

        /* STATUS BAR BOOTM */
        .global-status-bar {
          height: 22px;
          background: #0ea5e9;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          font-size: 11px;
          font-weight: 800;
          z-index: 100;
        }

        /* TERMINAL */
        .ide-terminal {
          height: 250px;
          background: #0f172a;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          z-index: 50;
        }

        .term-header {
          padding: 8px 15px;
          background: rgba(2, 6, 23, 0.4);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          font-weight: 900;
          color: #22d3ee;
          letter-spacing: 1px;
        }

        .term-body {
          flex: 1;
          padding: 12px 15px;
          font-family: 'Fira Code', monospace;
          font-size: 12px;
          overflow-y: auto;
          background: rgba(2, 6, 23, 0.2);
        }

        .term-line { margin-bottom: 4px; display: flex; gap: 12px; opacity: 0.9; }
        .term-time { color: #475569; min-width: 70px; }
        .term-text { flex: 1; border-left: 2px solid transparent; padding-left: 8px; }
        .term-text.system { color: #38bdf8; border-color: #38bdf8; font-weight: 700; }
        .term-text.stdout { color: #f8fafc; }
        .term-text.stderr { color: #ef4444; border-color: #ef4444; }

        .btn-icon {
          background: transparent; border: none; color: #64748b; cursor: pointer; padding: 4px; border-radius: 6px; transition: 0.2s;
        }
        .btn-icon:hover { color: #f8fafc; background: rgba(255, 255, 255, 0.05); }

        .lang-badge {
          background: rgba(34, 211, 238, 0.1);
          color: #22d3ee;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {/* ACTIVITY BAR */}
      <div className="activity-bar">
        <div className={`activity-icon ${activeActivity === 'explorer' ? 'active' : ''}`} onClick={() => setActiveActivity('explorer')}><Layers size={20}/></div>
        <div className="activity-icon"><Search size={20}/></div>
        <div className="activity-icon"><GitBranch size={20}/></div>
        <div className="activity-icon"><Monitor size={20}/></div>
        <div style={{ flex: 1 }} />
        <div className="activity-icon"><Settings size={20}/></div>
      </div>

      {/* EXPLORER SIDEBAR */}
      <div className="ide-sidebar" style={{ width: activeActivity === 'explorer' ? sidebarWidth : 0, opacity: activeActivity === 'explorer' ? 1 : 0, overflow: 'hidden' }}>
        <div className="side-header">
          <span className="side-title">Explorer</span>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={createNewFile} className="btn-icon" title="New File"><FilePlus size={16}/></button>
            <button className="btn-icon" title="New Folder"><FolderPlus size={16}/></button>
          </div>
        </div>
        
        <div className="file-list">
          {files.map(file => (
            <div 
              key={file.id} 
              className={`file-item ${activeFileId === file.id ? 'active' : ''}`}
              onClick={() => openFile(file.id)}
            >
              <FileCode size={16} color={activeFileId === file.id ? '#22d3ee' : '#64748b'} />
              <span style={{ flex: 1 }}>{file.name}</span>
              <Trash2 className="delete-icon" size={14} onClick={(e) => deleteFile(e, file.id)} />
            </div>
          ))}
        </div>

        <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
           <div style={{ fontSize: 9, color: '#475569', fontWeight: 900, marginBottom: 8, letterSpacing: 1 }}>INFRASTRUCTURE STATUS</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={12} color="#10b981" />
              <span style={{ fontSize: 10, color: '#94a3b8' }}>PISTON-NODE-01: OK</span>
           </div>
        </div>
      </div>

      {/* MAIN IDE AREA */}
      <div className="ide-main">
        
        {/* TABS */}
        <div className="tab-strip">
          <AnimatePresence>
            {openTabs.map(tid => {
              const file = files.find(f => f.id === tid);
              if (!file) return null;
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, width: 0 }}
                  key={tid} 
                  className={`ide-tab ${activeFileId === tid ? 'active' : ''}`}
                  onClick={() => setActiveFileId(tid)}
                >
                  <FileCode size={14} />
                  <span>{file.name}</span>
                  <X size={12} className="btn-icon" onClick={(e) => closeTab(e, tid)} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* TOOLBAR */}
        <div className="ide-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="lang-badge">
              {activeFile ? LANGUAGE_CONFIG[activeFile.language]?.label || activeFile.language : 'IDLE'}
            </div>
            <div style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Code size={12} /> UTF-8
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn-icon" title="Save File"><Save size={16}/></button>
            <button className="btn-icon" title="Editor Settings"><Settings size={16}/></button>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.05)', margin: '0 5px' }} />
            <button 
              onClick={runCode} 
              disabled={isLoading || !activeFile} 
              className="run-btn"
            >
              {isLoading ? <Loader2 size={14} className="spin" /> : <Play size={14} />}
              <span>EXECUTE CODE</span>
            </button>
            <button onClick={() => setShowTerminal(!showTerminal)} className="btn-icon">
              <PanelBottom size={18} color={showTerminal ? '#22d3ee' : '#64748b'} />
            </button>
          </div>
        </div>

        {/* EDITOR AREA */}
        <div className="editor-pane">
          {activeFile ? (
            <Editor 
              height="100%" 
              theme="vs-dark" 
              language={activeFile.language}
              value={activeFile.content}
              onChange={updateContent}
              options={{ 
                minimap: { enabled: true, side: 'right', scale: 1 }, 
                fontSize: 14, 
                fontFamily: '"Fira Code", monospace',
                lineNumbers: 'on',
                padding: { top: 15 },
                backgroundColor: 'transparent',
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: true,
                wordWrap: 'on',
                scrollbar: { vertical: 'visible', horizontal: 'visible' }
              }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#334155' }}>
              <Box size={48} opacity={0.2} style={{ marginBottom: 15 }} />
              <p style={{ fontSize: 14, fontWeight: 700 }}>Initialize a new module to start building.</p>
            </div>
          )}

          {/* TERMINAL */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 250 }}
                exit={{ height: 0 }}
                className="ide-terminal"
              >
                <div className="term-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Terminal size={12} />
                    <span>SYSTEM COMPILER LOGS</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setOutput([])} className="btn-icon" title="Clear Console"><Trash2 size={12}/></button>
                    <button onClick={() => setShowTerminal(false)} className="btn-icon"><X size={12}/></button>
                  </div>
                </div>
                <div className="term-body">
                  {output.map((log, i) => (
                    <div key={i} className="term-line">
                      <span className="term-time">[{log.time}]</span>
                      <div className={`term-text ${log.type}`}>
                        {log.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="term-line">
                      <span className="term-time">[{new Date().toLocaleTimeString()}]</span>
                      <div className="term-text system">
                        <Loader2 size={12} className="spin" style={{ display: 'inline', marginRight: 8 }} />
                        Initializing secure sandboxed environment...
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* WORLD CLASS STATUS BAR */}
        <div className="global-status-bar">
           <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                 <GitBranch size={12} />
                 <span>main*</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                 <AlertCircle size={12} />
                 <span>0</span>
                 <CheckCircle2 size={12} />
                 <span>0</span>
              </div>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                 <Cpu size={12} />
                 <span>sh-worker-v4</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                 <Globe size={12} />
                 <span>piston-api-stable</span>
              </div>
              <span>UTF-8</span>
           </div>
        </div>

      </div>
    </div>
  );
}

export default Coding;