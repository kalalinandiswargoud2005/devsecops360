const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const http = require('http'); // New: For Socket.io
const { Server } = require('socket.io'); // New: Socket.io library
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- HTTP ROUTES (REST API) ---
app.get('/', (req, res) => {
  res.json({ message: "DevSecOps 360 Backend is Running!" });
});

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (err) { console.error(err); res.status(500).send("Server Error"); }
});

app.get('/vulns', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vulnerabilities');
    res.json(result.rows);
  } catch (err) { console.error(err); res.status(500).send("Server Error"); }
});
// NEW: Accept new vulnerabilities from the Python Scanner
app.post('/vulns', async (req, res) => {
  try {
    const { severity, component, description } = req.body;
    
    // Insert into Supabase
    const newVuln = await pool.query(
      "INSERT INTO vulnerabilities (severity, component, description) VALUES ($1, $2, $3) RETURNING *",
      [severity, component, description]
    );

    // OPTIONAL: Alert the Dashboard in Real-Time (Bonus!)
    // io.emit('vuln_alert', newVuln.rows[0]); 

    res.json(newVuln.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- SOCKET.IO SETUP (REAL-TIME POKER) ---
const server = http.createServer(app); // Wrap Express in HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from anywhere (Vercel/Localhost)
    methods: ["GET", "POST"]
  }
});

// Poker Game State (Temporary Memory)
let pokerState = {
  votes: {},   // Stores { "User1": 5, "User2": 8 }
  show: false  // Are cards revealed?
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current state to new user
  socket.emit('gameState', pokerState);

  // 1. Listen for a Vote
  socket.on('vote', (data) => {
    // data = { user: "Nandeeshwar", value: 5 }
    pokerState.votes[data.user] = data.value;
    io.emit('gameState', pokerState); // Broadcast update to everyone
  });

  // 2. Listen for "Reveal Cards"
  socket.on('reveal', () => {
    pokerState.show = true;
    io.emit('gameState', pokerState);
  });

  // 3. Listen for "Reset Game"
  socket.on('reset', () => {
    pokerState = { votes: {}, show: false };
    io.emit('gameState', pokerState);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the SERVER (Note: We use 'server.listen', not 'app.listen')
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});