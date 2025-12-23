import React, { useState } from 'react';
import axios from 'axios';
import Editor from "@monaco-editor/react"; // <--- USING MONACO EDITOR
import { Send, Globe, Code, Layers, Loader2, Play } from 'lucide-react';

function Postman() {
  const [method, setMethod] = useState('POST'); // Default to POST to show body editing
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  // Default Body with valid JSON
  const [body, setBody] = useState('{\n  "title": "New Feature",\n  "body": "Testing API",\n  "userId": 1\n}');
  const [activeTab, setActiveTab] = useState('body'); 
  const [response, setResponse] = useState('// Response will appear here...');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [time, setTime] = useState(null);

  const handleSend = async () => {
    setIsLoading(true);
    setResponse('// Loading...');
    setStatus(null);
    const startTime = Date.now();

    try {
      // Parse Body safely
      let data = null;
      if (method !== 'GET' && method !== 'DELETE') {
        try {
          data = JSON.parse(body);
        } catch (e) {
          alert("Invalid JSON in Body");
          setIsLoading(false);
          return;
        }
      }

      const options = {
        method: method,
        url: url,
        headers: { 'Content-Type': 'application/json' },
        data: data
      };

      const res = await axios(options);
      setResponse(JSON.stringify(res.data, null, 2));
      setStatus(res.status);
    } catch (err) {
      console.error(err);
      const errRes = err.response ? err.response.data : { error: "Network Error or CORS Block" };
      setResponse(JSON.stringify(errRes, null, 2));
      setStatus(err.response ? err.status : 0);
    } finally {
      setTime(Date.now() - startTime);
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* 1. TOP BAR */}
      <div style={styles.header}>
        <div style={styles.title}><Globe size={20} color="#38bdf8"/> API TESTER</div>
        
        <div style={styles.inputGroup}>
          <select 
            value={method} 
            onChange={e => setMethod(e.target.value)} 
            style={{...styles.methodSelect, color: getMethodColor(method)}}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <input 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="Enter Request URL" 
            style={styles.urlInput} 
          />
          
          <button onClick={handleSend} disabled={isLoading} style={styles.sendBtn}>
            {isLoading ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
            <span style={{fontWeight:'bold'}}>SEND</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN GRID */}
      <div style={styles.grid}>
        
        {/* LEFT PANEL: REQUEST */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={{display:'flex', gap:'10px', alignItems:'center'}}>
              <Code size={14} color="#ccc"/> Request Body (JSON)
            </span>
          </div>
          
          <div style={styles.editorWrapper}>
            <Editor 
              height="100%" 
              theme="vs-dark"
              defaultLanguage="json"
              value={body}
              onChange={(value) => setBody(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>
        </div>

        {/* RIGHT PANEL: RESPONSE */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={{fontWeight:'bold'}}>Response</span>
            {status !== null && (
              <div style={styles.metaBadges}>
                <Badge label="Status" value={status} color={status >= 200 && status < 300 ? '#10b981' : '#ef4444'} />
                <Badge label="Time" value={`${time}ms`} color="#3b82f6" />
              </div>
            )}
          </div>

          <div style={styles.editorWrapper}>
             <Editor 
              height="100%" 
              theme="vs-dark"
              defaultLanguage="json"
              value={response}
              options={{
                readOnly: true, // Output is read-only
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- HELPERS ---
const getMethodColor = (m) => {
  if (m === 'GET') return '#3b82f6';
  if (m === 'POST') return '#10b981';
  if (m === 'DELETE') return '#ef4444';
  return '#f59e0b';
};

const Badge = ({ label, value, color }) => (
  <span style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', color: '#fff'}}>
    <span style={{color: color, fontWeight:'bold'}}>{label}:</span> {value}
  </span>
);

const styles = {
  container: { padding: '20px', height: '100%', boxSizing: 'border-box', background: '#0f172a', color: 'white', display:'flex', flexDirection:'column' },
  header: { marginBottom: '15px' },
  title: { fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#e2e8f0', letterSpacing:'1px' },
  
  inputGroup: { display: 'flex', height: '40px', background: '#1e293b', borderRadius: '6px', border: '1px solid #334155', overflow:'hidden' },
  methodSelect: { background: '#1e293b', border: 'none', borderRight:'1px solid #334155', padding: '0 15px', fontWeight: '800', outline: 'none', cursor: 'pointer' },
  urlInput: { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', padding: '0 15px', fontFamily: 'monospace' },
  sendBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '0 25px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition:'0.2s' },

  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, minHeight: 0 }, // minHeight 0 handles overflow correctly
  
  panel: { background: '#1e293b', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  panelHeader: { padding: '10px 15px', background: '#252526', borderBottom: '1px solid #334155', display:'flex', justifyContent:'space-between', alignItems:'center', height:'30px' },
  
  editorWrapper: { flex: 1, position: 'relative' }, // Ensures editor fills space
  metaBadges: { display: 'flex', gap: '15px' }
};

export default Postman;