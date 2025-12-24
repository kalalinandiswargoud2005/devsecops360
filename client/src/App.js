import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import Requirements from './pages/Requirements';
import Coding from './pages/Coding';
import Testing from './pages/Testing';
import Status from './pages/Status';
import Security from './pages/Security';
import Admin from './pages/Admin';
import Postman from './pages/Postman';
import Database from './pages/Database';

// Components
import Navbar from './components/Navbar';

// --- DEFAULT DATA (Used if LocalStorage is empty) ---
const INITIAL_USERS = [
  { id: 1, username: 'admin', role: 'Admin', password: '123' },
  { id: 2, username: 'dev', role: 'Developer', password: '123' }, 
  { id: 3, username: 'tester', role: 'Tester', password: '123' }
];

const INITIAL_PROJECTS = [
  { 
    id: 1, 
    name: "Neo-Banking App", 
    status: "In Progress", 
    deadline: "2025-12-31T23:59",
    planning: { tasks: [] }, 
    requirements: { userNeeds: [], systemReqs: [] } 
  },
  { 
    id: 2, 
    name: "E-Commerce Platform", 
    status: "Planning", 
    deadline: "2026-06-30T12:00",
    planning: { tasks: [] }, 
    requirements: { userNeeds: [], systemReqs: [] } 
  },
];

function App() {
  // 1. User Session State (Not persisted, so refresh logs you out - good for security demo)
  const [user, setUser] = useState(null);

  // 2. Persistent User Database
  const [usersDB, setUsersDB] = useState(() => {
    const savedUsers = localStorage.getItem('usersDB');
    return savedUsers ? JSON.parse(savedUsers) : INITIAL_USERS;
  });

  // 3. Persistent Project Data
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : INITIAL_PROJECTS;
  });

  // --- SAVE TO LOCAL STORAGE ON CHANGE ---
  useEffect(() => {
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
  }, [usersDB]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  // --- GLOBAL UPDATER ---
  const updateProject = (projectId, section, data) => {
    setProjects(prev => prev.map(p => {
      if (p.id === Number(projectId)) {
        if (section === 'deadline') return { ...p, deadline: data };
        return { ...p, [section]: data };
      }
      return p;
    }));
  };

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        {/* Only show Navbar if User is Logged In */}
        {user && <Navbar user={user} setUser={setUser} />}
        
        <div style={{ flex: 1, position: 'relative' }}>
          <AnimatedRoutes 
            user={user} 
            setUser={setUser}
            usersDB={usersDB} 
            setUsersDB={setUsersDB} 
            projects={projects} 
            setProjects={setProjects} 
            updateProject={updateProject} 
          />
        </div>
      </div>
    </Router>
  );
}

// Separate component to handle Route Animations
const AnimatedRoutes = ({ user, setUser, usersDB, setUsersDB, projects, setProjects, updateProject }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        
        {/* ROOT: Show Login if no user, else Dashboard */}
        <Route 
          path="/" 
          element={
            !user ? (
              <Login 
                setUser={setUser} 
                usersDB={usersDB} 
                setUsersDB={setUsersDB} 
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        
        {/* DASHBOARD */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard projects={projects} setProjects={setProjects} setUser={setUser} /> : <Navigate to="/" />} 
        />

        {/* PROJECT ROUTES */}
        <Route path="/project/:id/dashboard" element={<Dashboard projects={projects} setProjects={setProjects} setUser={setUser} />} />
        <Route path="/project/:id/planning" element={<Planning projects={projects} updateProject={updateProject} />} />
        <Route path="/project/:id/requirements" element={<Requirements projects={projects} updateProject={updateProject} />} />
        <Route path="/project/:id/coding" element={<Coding />} />
        <Route path="/project/:id/database" element={<Database />} />
        <Route path="/project/:id/testing" element={<Testing />} />
        <Route path="/project/:id/api" element={<Postman />} />
        <Route path="/project/:id/status" element={<Status projects={projects} updateProject={updateProject} />} />
        <Route path="/project/:id/security" element={<Security />} />

        {/* ADMIN (Protected) */}
        <Route 
          path="/project/:id/admin" 
          element={
            user && user.role === 'Admin' ? (
              <Admin usersDB={usersDB} setUsersDB={setUsersDB} />
            ) : (
              <Navigate to="/dashboard" />
            )
          } 
        />

      </Routes>
    </AnimatePresence>
  );
};

export default App;