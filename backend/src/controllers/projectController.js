// backend/src/controllers/projectController.js
const { pool } = require('../config/db');
const { asyncHandler } = require('../utils/helpers');

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Create project
        const projectResult = await client.query(
            'INSERT INTO projects (name, description, admin_user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, description, userId]
        );

        // Add creator as admin member
        await client.query(
            'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
            [projectResult.rows[0].id, userId, 'admin']
        );

        await client.query('COMMIT');
        res.status(201).json(projectResult.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});

const getProjects = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await pool.query(
        `SELECT p.*, pm.role, 
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count,
        (SELECT COUNT(*) FROM project_members WHERE project_id = p.id) as member_count
        FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        WHERE pm.user_id = $1
        ORDER BY p.created_at DESC`,
        [userId]
    );
    res.json(result.rows);
});

const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
        `SELECT p.*, pm.role,
        (SELECT json_agg(row_to_json(t)) FROM (
            SELECT * FROM tasks WHERE project_id = $1
        ) t) as tasks,
        (SELECT json_agg(row_to_json(m)) FROM (
            SELECT u.id, u.username, pm2.role 
            FROM project_members pm2 
            JOIN users u ON pm2.user_id = u.id 
            WHERE pm2.project_id = $1
        ) m) as members
        FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        WHERE p.id = $1 AND pm.user_id = $2`,
        [id, userId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
});

module.exports = {
    createProject,
    getProjects,
    getProjectById
};