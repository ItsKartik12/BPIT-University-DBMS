const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection [cite: 108-115]
const pool = new Pool({
    user: 'admin',      // Update if your local pgAdmin user is different
    host: 'localhost',
    database: 'university_db',
    password: 'password123',
    port: 5433,
});

// GET: Fetch all records from any table (Converts to uppercase for Postgres) [cite: 216]
app.get('/api/:table', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM "${req.params.table.toUpperCase()}"`);
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE: Remove a record using its specific Primary Key [cite: 5, 87]
app.delete('/api/:table/:idColumn/:idValue', async (req, res) => {
    try {
        const { table, idColumn, idValue } = req.params;
        await pool.query(`DELETE FROM "${table.toUpperCase()}" WHERE "${idColumn}" = $1`, [idValue]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST: Add Student [cite: 126-132, 183]
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

// POST: Add Faculty [cite: 151-160, 186]
app.post('/api/faculty', async (req, res) => {
    const { facultyId, name, designation, qualification, address, contact, deptId } = req.body;
    try {
        await pool.query(
            `INSERT INTO "FACULTY" ("FacultyID", "Name", "Designation", "Qualification", "Address", "Contact_No", "DeptID") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [facultyId, name, designation, qualification, address, contact, deptId]
        );
        res.status(201).json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST: Add Department [cite: 117-124, 181]
app.post('/api/departments', async (req, res) => {
    const { deptId, name, contact, hod, collegeId } = req.body;
    try {
        await pool.query(
            `INSERT INTO "DEPARTMENTS" ("DeptID", "Dept_Name", "Contact_No", "HOD_Name", "CollegeID") VALUES ($1, $2, $3, $4, $5)`,
            [deptId, name, contact, hod, collegeId]
        );
        res.status(201).json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(3000, () => console.log('🚀 Server running: http://localhost:3000'));