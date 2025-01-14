// backend/src/routes/projects.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Create project
        const result = await pool.query(
            'INSERT INTO projects (name, description, admin_user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, description, req.user.id]
        );

        // Add creator as admin member
        await pool.query(
            'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
            [result.rows[0].id, req.user.id, 'admin']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT p.* 
            FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.user_id = $1`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT p.*, pm.role
            FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE p.id = $1 AND pm.user_id = $2`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;