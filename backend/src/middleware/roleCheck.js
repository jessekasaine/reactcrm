const checkRole = (role) => {
    return async (req, res, next) => {
        try {
            const { project_id } = req.params;
            const userId = req.user.id;

            const result = await pool.query(
                'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
                [project_id, userId]
            );

            if (result.rows.length === 0 || result.rows[0].role !== role) {
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    };
};