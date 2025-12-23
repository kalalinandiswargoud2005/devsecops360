import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Login from './pages/Login'; // <--- Import Login
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

function App() {
  // 1. User State (Initially Null = Logged Out)
  const [user, setUser] = useState(null);

  // 2. Mock Data
  const [usersDB, setUsersDB] = useState([
    { id: 1, username: 'admin', role: 'Admin' },
    { id: 2, username: 'dev', role: 'Developer' },
  ]);

  const [projects, setProjects] = useState([
    { id: 1, name: "Neo-Banking App", status: "In Progress", deadline: "2025-12-31" },
    { id: 2, name: "E-Commerce Platform", status: "Planning", deadline: "2026-06-30" },
  ]);

  const updateProject = (projectId, section, data) => {
    setProjects(prev => prev.map(p => {
      if (p.id === Number(projectId)) return { ...p, [section]: data };
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
            setUser={setUser} // <--- Pass Setter to Routes
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
        
        {/* PROTECTED ROUTES */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard projects={projects} setProjects={setProjects} setUser={setUser} /> : <Navigate to="/" />} 
        />

        {/* ... Other Routes (Protect them similarly if needed) ... */}
        <Route path="/project/:id/dashboard" element={<Dashboard projects={projects} setProjects={setProjects} setUser={setUser} />} />
        <Route path="/project/:id/planning" element={<Planning projects={projects} updateProject={updateProject} />} />
        <Route path="/project/:id/requirements" element={<Requirements projects={projects} updateProject={updateProject} />} />
        <Route path="/project/:id/coding" element={<Coding />} />
        <Route path="/project/:id/database" element={<Database />} />
        <Route path="/project/:id/testing" element={<Testing />} />
        <Route path="/project/:id/api" element={<Postman />} />
        <Route path="/project/:id/status" element={<Status projects={projects} updateProject={updateProject} />} />
        <Route path="/project/:id/security" element={<Security />} />
        <Route path="/project/:id/admin" element={<Admin usersDB={usersDB} setUsersDB={setUsersDB} />} />

      </Routes>
    </AnimatePresence>
  );
};

export default App;