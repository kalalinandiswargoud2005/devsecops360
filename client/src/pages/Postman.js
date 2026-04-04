import React, { useState } from 'react';
import axios from 'axios';
import Editor from "@monaco-editor/react"; 
import { Send, Plus, Trash2, History, Globe, Shield, Activity, Settings, Loader2, Code, ExternalLink, Terminal } from 'lucide-react';

function Postman() {
  const [method, setMethod] = useState('POST'); 
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [body, setBody] = useState('{\n  "title": "New Feature",\n  "body": "Testing API",\n  "userId": 1\n}');
  const [response, setResponse] = useState('// Response will appear here...');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [time, setTime] = useState(null);

  const handleSend = async () => {
    setIsLoading(true);
    setResponse('// Handshaking with Gateway...');
    setStatus(null);
    const startTime = Date.now();

    try {
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
    <div className="postman-wrapper">
      <style>{`
        .postman-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #020617 100%);
          color: #f8fafc;
          font-family: var(--font-sans);
          padding: clamp(20px, 4vw, 40px);
          display: flex;
          flex-direction: column;
        }

        .top-bar {
          margin-bottom: 30px;
        }

        .page-title {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 800;
          color: #f8fafc;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .page-sub { color: #94a3b8; font-size: 14px; margin-bottom: 25px; }

        .request-bar {
          display: flex;
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          padding: 8px;
          gap: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .method-picker {
          background: #0f172a;
          border: 1px solid #334155;
          color: #f8fafc;
          padding: 0 20px;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
          outline: none;
        }

        .url-field {
          flex: 1;
          background: transparent;
          border: none;
          color: #f8fafc;
          font-size: 14px;
          padding: 0 15px;
          outline: none;
          font-family: "Fira Code", monospace;
        }

        .send-btn {
          background: #38bdf8;
          color: #0f172a;
          border: none;
          padding: 0 24px;
          border-radius: 10px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: 0.2s;
        }
        .send-btn:hover:not(:disabled) { background: #0ea5e9; transform: scale(1.02); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .main-workspace {
          display: grid;
          grid-template-columns: 1fr;
          gap: 25px;
          flex: 1;
        }
        @media (min-width: 1024px) {
          .main-workspace { grid-template-columns: 1fr 1fr; }
        }

        .editor-panel {
          background: #020617;
          border: 1px solid #1e293b;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-header {
          background: #0f172a;
          padding: 12px 20px;
          border-bottom: 1px solid #1e293b;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title { font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; }

        .badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; }

        .editor-container { flex: 1; padding: 10px; }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
      
      <div className="top-bar">
        <h1 className="page-title"><Globe size={28} color="#38bdf8"/> API GATEWAY ENGINE</h1>
        <p className="page-sub">Interrogate system endpoints and validate microservice responses.</p>
        
        <div className="request-bar">
          <select 
            value={method} 
            onChange={e => setMethod(e.target.value)} 
            className="method-picker"
            style={{color: getMethodColor(method)}}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <input 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="ENTER TARGET ENDPOINT URL" 
            className="url-field" 
          />
          
          <button onClick={handleSend} disabled={isLoading} className="send-btn">
            {isLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            <span>EXECUTE</span>
          </button>
        </div>
      </div>

      <div className="main-workspace">
        
        {/* REQUEST PANEL */}
        <div className="editor-panel">
          <div className="panel-header">
            <span className="header-title"><Code size={14} color="#38bdf8"/> INPUT PAYLOAD (JSON)</span>
            <ExternalLink size={14} color="#334155" />
          </div>
          
          <div className="editor-container">
            <Editor 
              height="100%" 
              theme="vs-dark"
              defaultLanguage="json"
              value={body}
              onChange={(value) => setBody(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: '"Fira Code", monospace',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                backgroundColor: 'transparent'
              }}
            />
          </div>
        </div>

        {/* RESPONSE PANEL */}
        <div className="editor-panel">
          <div className="panel-header">
            <span className="header-title"><Terminal size={14} color="#38bdf8"/> TARGET RESPONSE</span>
            {status !== null && (
              <div style={{display:'flex', gap:'10px'}}>
                <span className="badge" style={{background: status >= 200 && status < 300 ? '#10b98120' : '#ef444420', color: status >= 200 && status < 300 ? '#10b981' : '#ef4444'}}>
                  STATUS: {status}
                </span>
                <span className="badge" style={{background: '#38bdf820', color: '#38bdf8'}}>
                  TIME: {time}ms
                </span>
              </div>
            )}
          </div>

          <div className="editor-container">
             <Editor 
              height="100%" 
              theme="vs-dark"
              defaultLanguage="json"
              value={response}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: '"Fira Code", monospace',
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

const getMethodColor = (m) => {
  if (m === 'GET') return '#38bdf8';
  if (m === 'POST') return '#10b981';
  if (m === 'DELETE') return '#ef4444';
  return '#f59e0b';
};

export default Postman;