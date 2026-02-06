const db = require('../db');

// checking user existence and status
module.exports = async (req, res, next) => {
    const userId = req.headers['x-user-id'];

    // redirecting to login if no user ID in headers
    if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const [rows] = await db.query(
            `SELECT status FROM users WHERE user_id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (rows[0].status === 'blocked') {
            return res.status(403).json({ message: 'User is blocked' });
        }

        // user is valid
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};