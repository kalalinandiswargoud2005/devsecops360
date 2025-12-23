import React, { useState, useRef } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios'; // <--- IMPORT AXIOS
import { 
  Play, Terminal, Loader2, 
  Folder, FolderOpen, FileCode, File, 
  ChevronRight, ChevronDown, FilePlus, FolderPlus,
  X, PanelBottom, Trash2, UploadCloud
} from 'lucide-react';

/* ---------------- CONFIG: LANGUAGE VERSIONS ---------------- */
// Maps internal language names to Piston API versions
const LANGUAGE_VERSIONS = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  c: { language: 'c', version: '10.2.0' },
  cpp: { language: 'c++', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
};

/* ---------------- INITIAL STATE ---------------- */
const emptyExplorer = {
  id: 'root',
  name: 'PROJECT',
  isFolder: true,
  isOpen: true,
  items: [] 
};

function Coding() {
  const [explorer, setExplorer] = useState(emptyExplorer);
  const [activeFile, setActiveFile] = useState(null);
  const [output, setOutput] = useState(["> Terminal Ready"]);
  const [showTerminal, setShowTerminal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  /* ---------------- HELPERS ---------------- */
  const getLanguage = (filename) => {
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.java')) return 'java';
    if (filename.endsWith('.c')) return 'c';
    if (filename.endsWith('.cpp')) return 'cpp';
    if (filename.endsWith('.go')) return 'go';
    if (filename.endsWith('.rs')) return 'rust';
    if (filename.endsWith('.json')) return 'json';
    return 'plaintext';
  };

  /* ---------------- LOCAL FILE HANDLING ---------------- */
  const handleFileSelect = (event) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      processFiles(files);
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  };

  const processFiles = (files) => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          isFolder: false,
          language: getLanguage(file.name),
          content: e.target.result
        };
        setExplorer(prev => ({ ...prev, items: [...prev.items, newItem] }));
        if (!activeFile) setActiveFile(newItem); 
      };
      reader.readAsText(file);
    });
  };

  /* ---------------- TREE ACTIONS ---------------- */
  const createItem = (isFolder) => {
    const name = prompt(`Enter ${isFolder ? 'Folder' : 'File'} Name (e.g., test.py):`);
    if (!name) return;

    const lang = getLanguage(name);
    
    // Default Boilerplate content
    let content = `// New File: ${name}`;
    if (lang === 'python') content = `print("Hello from Python!")`;
    if (lang === 'java') content = `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`;
    if (lang === 'javascript') content = `console.log("Hello from Node.js!");`;

    const newItem = {
      id: Date.now().toString(),
      name: name,
      isFolder: isFolder,
      isOpen: false,
      items: isFolder ? [] : undefined,
      language: lang,
      content: isFolder ? null : content
    };

    setExplorer(prev => ({ ...prev, items: [...prev.items, newItem] }));
    if (!isFolder) setActiveFile(newItem);
  };

  const deleteItem = (e, itemId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this item?")) return;
    
    const deleteNode = (node) => {
      if (!node.items) return node;
      return { 
        ...node, 
        items: node.items.filter(i => i.id !== itemId).map(deleteNode) 
      };
    };

    setExplorer(prev => deleteNode(prev));
    if (activeFile && activeFile.id === itemId) setActiveFile(null);
  };

  /* ---------------- RUN CODE (REAL API EXECUTION) ---------------- */
  const runCode = async () => {
    if (!activeFile) {
      alert("Please select a file to run!");
      return;
    }

    if (!showTerminal) setShowTerminal(true);
    setIsLoading(true);
    setOutput([]); // Clear previous
    setOutput(prev => [...prev, `> Compiling ${activeFile.name}...`]);

    const runtime = LANGUAGE_VERSIONS[activeFile.language];

    // If language is not supported by API (e.g., HTML, CSS, JSON)
    if (!runtime) {
      setIsLoading(false);
      setOutput(prev => [...prev, `⚠️ Execution not supported for .${activeFile.language} files yet.`]);
      return;
    }

    try {
      // CALL PISTON API
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: runtime.language,
        version: runtime.version,
        files: [
          {
            name: activeFile.name,
            content: activeFile.content
          }
        ]
      });

      const { run } = response.data;
      
      // Handle Output
      if (run.stdout) {
        // Split by newline to render nicely
        const lines = run.stdout.split('\n');
        setOutput(prev => [...prev, ...lines]);
      }
      
      // Handle Errors
      if (run.stderr) {
        const errLines = run.stderr.split('\n');
        setOutput(prev => [...prev, ...errLines.map(l => `❌ ${l}`)]);
      }

      setOutput(prev => [...prev, `✅ Process finished with exit code ${run.code}`]);

    } catch (error) {
      console.error(error);
      setOutput(prev => [...prev, "❌ Network Error: Could not connect to compiler API."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={styles.container}
      onDragOver={onDragOver} 
      onDragLeave={onDragLeave} 
      onDrop={onDrop}
    >
      <input type="file" multiple ref={fileInputRef} style={{display:'none'}} onChange={handleFileSelect} />

      {/* 1. SIDEBAR */}
      <div style={{...styles.sidebar, borderRight: isDragging ? '2px dashed #3b82f6' : '1px solid #333'}}>
        <div style={styles.sidebarHeader}>
          <span style={{fontWeight:'bold', color:'#ccc', fontSize:'11px'}}>EXPLORER</span>
          <div style={{display:'flex', gap:'5px'}}>
            <button onClick={() => fileInputRef.current.click()} style={styles.iconBtn} title="Open Local Files"><UploadCloud size={16}/></button>
            <button onClick={() => createItem(false)} style={styles.iconBtn} title="New File"><FilePlus size={16}/></button>
            <button onClick={() => createItem(true)} style={styles.iconBtn} title="New Folder"><FolderPlus size={16}/></button>
          </div>
        </div>
        
        <div style={{flex: 1, overflowY:'auto'}}>
          {explorer.items.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No Open Files</p>
              <button onClick={() => fileInputRef.current.click()} style={styles.uploadBtn}>Open File</button>
              <span style={{fontSize:'10px', color:'#666', marginTop:'10px'}}>or Drag & Drop here</span>
            </div>
          ) : (
            <FileTree item={explorer} activeId={activeFile?.id} onSelect={setActiveFile} onDelete={deleteItem} />
          )}
        </div>
      </div>

      {/* 2. MAIN AREA */}
      <div style={styles.mainArea}>
        
        {/* TAB BAR */}
        <div style={styles.tabBar}>
          <div style={styles.activeTab}>
            <FileCode size={14} color="#fcd34d" />
            {activeFile?.name || "No File Selected"}
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <button onClick={runCode} disabled={isLoading} style={styles.runBtn}>
              {isLoading ? <Loader2 size={14} className="spin" /> : <Play size={14} />} Run
            </button>
            <button onClick={() => setShowTerminal(!showTerminal)} style={styles.iconBtn}>
              <PanelBottom size={18} color={showTerminal ? "white" : "#666"} />
            </button>
          </div>
        </div>

        {/* EDITOR */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {activeFile ? (
             <Editor 
              height="100%" 
              theme="vs-dark" 
              language={activeFile.language}
              value={activeFile.content}
              onChange={(val) => setActiveFile({...activeFile, content: val})}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          ) : (
            <div style={styles.dragOverlay}>
              <UploadCloud size={48} color="#333" />
              <p style={{color:'#666', marginTop:'10px'}}>Open a file or Drag & Drop here</p>
            </div>
          )}

          {/* TERMINAL */}
          {showTerminal && (
            <div style={styles.terminalOverlay}>
              <div style={styles.terminalHeader}>
                <span style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <Terminal size={12} /> TERMINAL
                </span>
                <div style={{display:'flex', gap:'10px'}}>
                  <button onClick={() => setOutput([])} style={styles.iconBtn}><Trash2 size={14}/></button>
                  <button onClick={() => setShowTerminal(false)} style={styles.iconBtn}><X size={14}/></button>
                </div>
              </div>
              <div style={styles.terminalBody}>
                {output.map((line, i) => (
                  <div key={i} style={{marginBottom:'4px', color: line.includes('❌')?'#ef4444': line.includes('✅')?'#4ade80':'#e5e7eb', fontFamily:'monospace'}}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* STATUS BAR */}
        <div style={styles.statusBar}>
           <div style={{display:'flex', alignItems:'center', gap:'5px'}}><Terminal size={12}/> Ready</div>
           <div>{activeFile ? activeFile.language.toUpperCase() : '-'}</div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- RECURSIVE FILE TREE ---------------- */
const FileTree = ({ item, activeId, onSelect, onDelete, depth = 0 }) => {
  const [open, setOpen] = useState(item.isOpen || false);
  const [hover, setHover] = useState(false);

  if (item.id === 'root') {
    return item.items.map(child => (
      <FileTree key={child.id} item={child} activeId={activeId} onSelect={onSelect} onDelete={onDelete} depth={0} />
    ));
  }

  return (
    <div>
      <div 
        onClick={() => item.isFolder ? setOpen(!open) : onSelect(item)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...styles.fileRow, 
          paddingLeft: `${depth * 15 + 10}px`,
          background: activeId === item.id ? '#37373d' : hover ? '#2a2d2e' : 'transparent',
          color: activeId === item.id ? 'white' : '#cccccc'
        }}
      >
        <span style={{marginRight:'6px', display:'flex'}}>
          {item.isFolder && (open ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </span>
        {item.isFolder ? <Folder size={16} color={open?"#E0E0E0":"#90a4ae"} style={{marginRight:'6px'}}/> : <FileIcon name={item.name} />}
        <span style={{flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{item.name}</span>
        {hover && (
          <button onClick={(e) => onDelete(e, item.id)} style={styles.deleteBtn} title="Delete">
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {item.isFolder && open && item.items && item.items.map(child => (
        <FileTree key={child.id} item={child} activeId={activeId} onSelect={onSelect} onDelete={onDelete} depth={depth + 1} />
      ))}
    </div>
  );
};

const FileIcon = ({ name }) => {
  if (name.endsWith('.js')) return <FileCode size={16} color="#fcd34d" style={{marginRight:'6px'}} />;
  if (name.endsWith('.py')) return <File size={16} color="#3b82f6" style={{marginRight:'6px'}} />;
  if (name.endsWith('.java')) return <File size={16} color="#ea580c" style={{marginRight:'6px'}} />;
  if (name.endsWith('.html')) return <FileCode size={16} color="#e11d48" style={{marginRight:'6px'}} />;
  if (name.endsWith('.css')) return <FileCode size={16} color="#2563eb" style={{marginRight:'6px'}} />;
  return <File size={16} color="#94a3b8" style={{marginRight:'6px'}} />;
};

/* ---------------- STYLES ---------------- */
const styles = {
  container: { display: 'flex', height: '100vh', background: '#1e1e1e', color: '#fff', overflow:'hidden' },
  sidebar: { width: '240px', background: '#252526', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height:'35px', borderBottom: '1px solid #333' },
  iconBtn: { background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer', padding:'4px', display:'flex', alignItems:'center' },
  fileRow: { display: 'flex', alignItems: 'center', padding: '4px 0', fontSize: '13px', cursor: 'pointer', height:'28px' },
  deleteBtn: { background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding:'4px', marginRight:'5px' },
  emptyState: { padding:'20px', textAlign:'center', color:'#666', fontSize:'12px', display:'flex', flexDirection:'column', alignItems:'center' },
  uploadBtn: { marginTop:'10px', padding:'6px 12px', background:'#3b82f6', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  
  mainArea: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  tabBar: { height: '36px', background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingRight:'10px' },
  activeTab: { height: '100%', background: '#1e1e1e', color: 'white', padding: '0 15px', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '2px solid #3b82f6', fontSize: '13px', borderRight: '1px solid #333' },
  runBtn: { background: '#10b981', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' },
  
  dragOverlay: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#444' },

  terminalOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '220px', background: '#1e1e1e', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', boxShadow: '0 -4px 15px rgba(0,0,0,0.5)', zIndex: 50 },
  terminalHeader: { padding: '5px 15px', background: '#252526', color: '#ccc', fontSize: '11px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  terminalBody: { flex: 1, padding: '15px', fontFamily: '"Fira Code", monospace', fontSize: '13px', overflowY: 'auto' },
  
  statusBar: { height: '22px', background: '#007acc', color: 'white', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '12px', gap: '15px', zIndex: 60, justifyContent:'space-between' }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default Coding;