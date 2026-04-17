import React, { useState, useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios'; 
import { 
  Play, Terminal, Loader2, FileCode, FilePlus, FolderPlus,
  X, PanelBottom, Trash2, Box, Save, Settings, Layers, Code, Zap,
  Search, GitBranch, AlertCircle, CheckCircle2, Monitor, Cpu, Globe,
  ChevronRight, ChevronDown, Folder, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGE_MAP = {
  js: 'javascript',
  py: 'python',
  java: 'java',
  html: 'html',
  css: 'css',
  json: 'json'
};

const JUDGE0_CONFIG = {
  javascript: 63,
  python: 71,
  java: 62,
};

const INITIAL_FILES = [
  { 
    id: '1', 
    name: 'main.py', 
    type: 'file', 
    language: 'python', 
    content: 'print("Hello from DevSecOps360!")\n# Try writing some HTML files to see the preview!' 
  },
  {
    id: 'f1',
    name: 'web_module',
    type: 'folder',
    isOpen: true,
    children: [
      { id: '2', name: 'index.html', type: 'file', language: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { background: #0f172a; color: #22d3ee; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }\n  h1 { border: 2px solid #22d3ee; padding: 20px; border-radius: 10px; }\n</style>\n</head>\n<body>\n  <h1>DevSecOps360 Live Preview</h1>\n</body>\n</html>' },
      { id: '3', name: 'styles.css', type: 'file', language: 'css', content: 'body { color: red; }' }
    ]
  }
];

function Coding() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [openTabs, setOpenTabs] = useState(['1', '2']);
  const [activeFileId, setActiveFileId] = useState('2');
  const [output, setOutput] = useState([{ type: 'system', text: "DevSecOps Virtual Compiler v4.5 Initialized...", time: new Date().toLocaleTimeString() }]);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const terminalEndRef = useRef(null);

  // Flatten search for active file
  const findFile = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFile(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFile = findFile(files, activeFileId);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output, isLoading]);

  const updateContent = (val) => {
    const updateNode = (nodes) => nodes.map(node => {
      if (node.id === activeFileId) return { ...node, content: val };
      if (node.children) return { ...node, children: updateNode(node.children) };
      return node;
    });
    setFiles(updateNode(files));
  };

  const addNode = (type, parentId = null) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    const newNode = {
      id: Date.now().toString(),
      name,
      type,
      ...(type === 'file' ? { 
        language: LANGUAGE_MAP[name.split('.').pop()] || 'javascript', 
        content: '' 
      } : { children: [], isOpen: true })
    };

    if (!parentId) {
      setFiles([...files, newNode]);
    } else {
      const updateNodes = (nodes) => nodes.map(node => {
        if (node.id === parentId) return { ...node, children: [...node.children, newNode], isOpen: true };
        if (node.children) return { ...node, children: updateNodes(node.children) };
        return node;
      });
      setFiles(updateNodes(files));
    }

    if (type === 'file') {
      setActiveFileId(newNode.id);
      if (!openTabs.includes(newNode.id)) setOpenTabs([...openTabs, newNode.id]);
    }
  };

  const deleteNode = (id) => {
    if (!window.confirm("Delete this item?")) return;
    const removeNode = (nodes) => nodes.filter(node => {
      if (node.id === id) return false;
      if (node.children) {
        const filteredChildren = removeNode(node.children);
        node.children = filteredChildren;
      }
      return true;
    });
    setFiles(removeNode([...files]));
    setOpenTabs(openTabs.filter(tid => tid !== id));
    if (activeFileId === id) setActiveFileId(null);
  };

  const toggleFolder = (id) => {
    const toggleNodes = (nodes) => nodes.map(node => {
      if (node.id === id) return { ...node, isOpen: !node.isOpen };
      if (node.children) return { ...node, children: toggleNodes(node.children) };
      return node;
    });
    setFiles(toggleNodes(files));
  };

  const runCode = async () => {
    if (!activeFile || activeFile.type !== 'file') return;
    setShowTerminal(true);
    setIsLoading(true);
    const timestamp = () => new Date().toLocaleTimeString();
    
    setOutput(prev => [...prev, { type: 'system', text: `> Initializing secure sandbox for ${activeFile.name}...`, time: timestamp() }]);

    try {
      const languageId = JUDGE0_CONFIG[activeFile.language];
      if (!languageId) throw new Error("Language not supported for execution");

      const resp = await axios.post('http://localhost:5000/api/execute', {
        source_code: activeFile.content,
        language_id: languageId
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

  const FileTree = ({ nodes, depth = 0 }) => (
    <div style={{ marginLeft: depth * 12 }}>
      {nodes.map(node => (
        <div key={node.id}>
          <div 
            className={`file-item ${activeFileId === node.id ? 'active' : ''}`}
            onClick={() => node.type === 'file' ? (setActiveFileId(node.id), !openTabs.includes(node.id) && setOpenTabs([...openTabs, node.id])) : toggleFolder(node.id)}
            style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              {node.type === 'folder' ? (node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <FileCode size={14} />}
              {node.type === 'folder' ? <Folder size={14} className="text-blue-400" /> : null}
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
            </div>
            <div className="file-actions" style={{ opacity: 0.5 }}>
              <Trash2 size={12} onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }} />
            </div>
          </div>
          {node.type === 'folder' && node.isOpen && <FileTree nodes={node.children} depth={depth + 1} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="ide-container">
      <style>{`
        .ide-container { display: flex; height: 100vh; background: #020617; color: #f8fafc; overflow: hidden; font-family: 'Inter', sans-serif; }
        .activity-bar { width: 50px; background: #0f172a; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; padding-top: 15px; gap: 20px; }
        .activity-icon { color: #64748b; cursor: pointer; transition: 0.2s; }
        .activity-icon:hover, .activity-icon.active { color: #22d3ee; }
        .ide-sidebar { width: 260px; background: rgba(15, 23, 42, 0.4); border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
        .side-title { padding: 15px; font-size: 11px; font-weight: 900; color: #64748b; letter-spacing: 1px; display: flex; justify-content: space-between; align-items: center; }
        .ide-main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }
        .tab-strip { height: 35px; background: #0f172a; display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); overflow-x: auto; }
        .ide-tab { padding: 0 15px; height: 100%; display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; border-right: 1px solid #020617; cursor: pointer; transition: 0.2s; white-space: nowrap; }
        .ide-tab.active { background: #020617; color: #22d3ee; border-top: 2px solid #22d3ee; }
        .ide-toolbar { height: 45px; background: #020617; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .run-btn { background: #10b981; color: white; border: none; padding: 6px 16px; border-radius: 6px; font-weight: 800; font-size: 11px; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .preview-btn { background: #6366f1; color: white; border: none; padding: 6px 16px; border-radius: 6px; font-weight: 800; font-size: 11px; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .editor-pane { flex: 1; position: relative; overflow: hidden; display: flex; }
        .monaco-wrapper { flex: 1; height: 100%; position: relative; }
        .preview-pane { flex: 1; background: white; border-left: 2px solid #22d3ee; display: flex; flex-direction: column; }
        .preview-header { padding: 5px 15px; background: #f1f5f9; color: #475569; font-size: 11px; font-weight: bold; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; }

        .ide-terminal {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 250px;
          background: #020617;
          border-top: 2px solid #22d3ee;
          display: flex;
          flex-direction: column;
          z-index: 50;
          box-shadow: 0 -10px 25px rgba(0,0,0,0.5);
        }

        .term-header { padding: 8px 15px; background: #0f172a; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #22d3ee; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .term-body { flex: 1; padding: 15px; font-family: 'Fira Code', monospace; font-size: 13px; overflow-y: auto; }
        .term-line { margin-bottom: 4px; display: flex; gap: 12px; }
        .term-time { color: #475569; min-width: 85px; }
        .term-text.stdout { color: #f8fafc; }
        .term-text.system { color: #38bdf8; font-weight: bold; }

        .global-status-bar { height: 25px; background: #0ea5e9; color: #0f172a; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; font-size: 11px; font-weight: 900; z-index: 60; position: relative; }
        
        .file-item { padding: 6px 15px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px; color: #94a3b8; transition: 0.2s; }
        .file-item:hover { background: rgba(255,255,255,0.03); }
        .file-item.active { background: rgba(34, 211, 238, 0.1); color: #22d3ee; border-left: 2px solid #22d3ee; }
        .file-actions:hover { color: #ef4444; }
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
        <div className="side-title">
          EXPLORER
          <div style={{ display: 'flex', gap: '8px' }}>
            <FilePlus size={14} className="activity-icon" onClick={() => addNode('file')} title="New File" />
            <FolderPlus size={14} className="activity-icon" onClick={() => addNode('folder')} title="New Folder" />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <FileTree nodes={files} />
        </div>
      </div>

      <div className="ide-main">
        <div className="tab-strip">
          {openTabs.map(tid => {
            const f = findFile(files, tid);
            if (!f) return null;
            return (
              <div key={tid} className={`ide-tab ${activeFileId === tid ? 'active' : ''}`} onClick={() => setActiveFileId(tid)}>
                <FileCode size={12} /> {f.name}
                <X size={12} onClick={(e) => { e.stopPropagation(); setOpenTabs(openTabs.filter(t => t !== tid)); }} />
              </div>
            );
          })}
        </div>

        <div className="ide-toolbar">
          <div style={{ color: '#22d3ee', fontSize: '11px', fontWeight: 'bold' }}>{activeFile?.language?.toUpperCase()}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {['html', 'css', 'javascript'].includes(activeFile?.language) && (
              <button className="preview-btn" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />} PREVIEW
              </button>
            )}
            <button className="run-btn" onClick={runCode} disabled={isLoading}>
              {isLoading ? <Loader2 size={14} className="spin" /> : <Play size={14} />} EXECUTE
            </button>
            <PanelBottom className={`activity-icon ${showTerminal ? 'active' : ''}`} size={20} onClick={() => setShowTerminal(!showTerminal)} />
          </div>
        </div>

        <div className="editor-pane">
          <div className="monaco-wrapper">
            <Editor 
              height="100%" 
              theme="vs-dark" 
              language={activeFile?.language} 
              value={activeFile?.content || ''} 
              onChange={updateContent}
              options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'Fira Code' }}
            />
            
            <AnimatePresence>
              {showTerminal && (
                <motion.div initial={{ y: 250 }} animate={{ y: 0 }} exit={{ y: 250 }} transition={{ type: 'tween', duration: 0.2 }} className="ide-terminal">
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

          {showPreview && (
            <div className="preview-pane">
              <div className="preview-header">
                <span>LIVE PREVIEW</span>
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setShowPreview(false)} />
              </div>
              <iframe 
                title="preview"
                style={{ flex: 1, border: 'none', background: 'white' }}
                srcDoc={activeFile?.language === 'html' ? activeFile.content : `<html><body style="background: #f8fafc; padding: 20px; font-family: sans-serif;"><pre>${activeFile?.content}</pre></body></html>`}
              />
            </div>
          )}
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