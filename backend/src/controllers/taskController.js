// backend/src/controllers/taskController.js
const { pool } = require('../config/db');
const { asyncHandler } = require('../utils/helpers');

const createTask = asyncHandler(async (req, res) => {
    const { project_id, title, description } = req.body;
    const userId = req.user.id;

    // Verify project membership
    const memberCheck = await pool.query(
        'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
        [project_id, userId]
    );

    if (memberCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Not a project member' });
    }

    const result = await pool.query(
        `INSERT INTO tasks (project_id, title, description, status)
        VALUES ($1, $2, $3, 'To Do')
        RETURNING *`,
        [project_id, title, description]
    );

    res.status(201).json(result.rows[0]);
});

const updateTaskStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, assigned_to } = req.body;
    const userId = req.user.id;

    const validStatuses = ['To Do', 'In Progress', 'Review', 'Done'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await pool.query(
        `UPDATE tasks 
        SET status = COALESCE($1, status),
            assigned_to = COALESCE($2, assigned_to),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 AND project_id IN (
            SELECT project_id FROM project_members WHERE user_id = $4
        )
        RETURNING *`,
        [status, assigned_to, id, userId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.json(result.rows[0]);
});

module.exports = {
    createTask,
    updateTaskStatus
};