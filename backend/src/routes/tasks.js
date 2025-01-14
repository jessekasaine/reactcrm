// backend/src/routes/tasks.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const { project_id, title, description } = req.body;

        // Check if user is project member
        const memberCheck = await pool.query(
            'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
            [project_id, req.user.id]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Not a project member' });
        }

        const result = await pool.query(
            'INSERT INTO tasks (project_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [project_id, title, description, 'To Do']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
    try {
        const { status, assigned_to } = req.body;

        // Check if user is project member
        const task = await pool.query(
            `SELECT t.*, pm.role 
            FROM tasks t
            JOIN project_members pm ON t.project_id = pm.project_id
            WHERE t.id = $1 AND pm.user_id = $2`,
            [req.params.id, req.user.id]
        );

        if (task.rows.length === 0) {
            return res.status(403).json({ error: 'Not authorized to modify this task' });
        }

        const result = await pool.query(
            'UPDATE tasks SET status = COALESCE($1, status), assigned_to = COALESCE($2, assigned_to) WHERE id = $3 RETURNING *',
            [status, assigned_to, req.params.id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;