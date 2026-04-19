const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'university_db',
    password: 'password123',
    port: 5433,
});

// GET: Fetch all records from a table
app.get('/api/:table', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM "${req.params.table.toUpperCase()}"`);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE: Remove a record by ID
app.delete('/api/:table/:idColumn/:idValue', async (req, res) => {
    try {
        const { table, idColumn, idValue } = req.params;
        await pool.query(`DELETE FROM "${table.toUpperCase()}" WHERE "${idColumn}" = $1`, [idValue]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST: Universal Add Logic (Example for Students)
app.post('/api/students', async (req, res) => {
    const { rollNo, name, year, address, contact } = req.body;
    try {
        await pool.query(
            `INSERT INTO "STUDENTS" ("RollNo", "Name", "Year", "Address", "Contact_No") VALUES ($1, $2, $3, $4, $5)`,
            [rollNo, name, year, address, contact]
        );
        res.status(201).json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(3000, () => console.log('🚀 Server running: http://localhost:3000'));