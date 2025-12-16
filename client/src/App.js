import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  // This runs automatically when the page loads
  useEffect(() => {
    // Ask the Backend for the tasks
    axios.get('https://devsecops-backend-g7qn.onrender.com/tasks')
      .then(response => {
        setTasks(response.data); // Save the data to React state
      })
      .catch(error => {
        console.error("Error connecting to backend:", error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>DevSecOps 360 Dashboard</h1>
        
        {/* Render the list of tasks */}
        <div style={{ padding: '20px', backgroundColor: '#282c34', color: 'white' }}>
            <h3>Current Tasks from Supabase:</h3>
            <ul>
                {tasks.map(task => (
                    <li key={task.id} style={{ margin: '10px 0' }}>
                        <strong>{task.title}</strong> — <span style={{ color: '#61dafb' }}>{task.status}</span>
                    </li>
                ))}
            </ul>
        </div>

      </header>
    </div>
  );
}

export default App;