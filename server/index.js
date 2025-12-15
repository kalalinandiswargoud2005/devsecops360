const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 1. Root Route (Health Check)
app.get('/', (req, res) => {
    res.json({ message: "DevSecOps 360 Backend is Running!" });
});

// 2. GET Tasks Route (The new feature)
app.get('/tasks', async (req, res) => {
    try {
        const allTasks = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
        res.json(allTasks.rows); // Send the rows back to the frontend
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});