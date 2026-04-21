const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Database Connection
// This uses your Render environment variable or the fallback link
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_EReuSt2A6Qdi@ep-sparkling-meadow-amhc2esk-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000, // Wait 10s for Neon to wake up
});

// 3. GET Route (Fetch Data)
app.get('/api/:table', async (req, res) => {
    const tableName = req.params.table.toUpperCase();
    try {
        // Double quotes handle the Uppercase table names in your SQL
        const result = await pool.query(`SELECT * FROM "${tableName}"`);
        res.json(result.rows);
    } catch (err) {
        console.error(`Error fetching ${tableName}:`, err.message);
        res.status(500).json({
            error: err.message,
            hint: `Make sure table "${tableName}" exists in your Neon SQL Editor.`
        });
    }
});

// 4. POST Route (Add Data)
app.post('/api/:table', async (req, res) => {
    const tableName = req.params.table.toUpperCase();
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    try {
        await pool.query(`INSERT INTO "${tableName}" (${columns}) VALUES (${placeholders})`, values);
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE Route
app.delete('/api/:table/:idColumn/:idValue', async (req, res) => {
    const tableName = req.params.table.toUpperCase();
    const { idColumn, idValue } = req.params;
    try {
        await pool.query(`DELETE FROM "${tableName}" WHERE "${idColumn}" = $1`, [idValue]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health Check
app.get('/', (req, res) => res.send('BPIT University Management System API is LIVE!'));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));