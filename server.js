const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Pool (Prevents timeouts)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database Connection Failed:", err.message);
    } else {
        console.log("Connected to MySQL Database");
        connection.release();
    }
});

/** * GET ALL RECORDS
 * Supports: /api/students, /api/faculty, etc.
 */
app.get('/api/:table', (req, res) => {
    const table = req.params.table.toUpperCase();
    const sql = `SELECT * FROM ??`;
    db.query(sql, [table], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

/** * POST NEW RECORD
 * Dynamically inserts into the specified table
 */
app.post('/api/:table', (req, res) => {
    const table = req.params.table.toUpperCase();
    const data = req.body;
    const sql = `INSERT INTO ?? SET ?`;
    db.query(sql, [table, data], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Record added successfully", id: result.insertId });
    });
});

/** * DELETE RECORD
 * Format: /api/:table/:pk_column/:id
 * Example: /api/students/RollNo/101
 */
app.delete('/api/:table/:pk/:id', (req, res) => {
    const { table, pk, id } = req.params;
    const sql = `DELETE FROM ?? WHERE ?? = ?`;
    db.query(sql, [table.toUpperCase(), pk, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully" });
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
