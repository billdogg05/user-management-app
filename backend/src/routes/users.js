const express = require('express');
const router = express.Router();
const db = require('../db');

// getting users for table
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT 
                user_id,
                first_name,
                last_name,
                user_email,
                status,
                last_login_datetime
            FROM users
            ORDER BY last_login_datetime DESC`
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// blocking selected users
router.post('/block', async (req, res) => {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: 'No users selected' });
    }

    try {
        await db.query(
            `UPDATE users SET status = 'blocked' WHERE user_id IN (?)`,
            [userIds]
        );

        res.json({ message: 'Users blocked' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// unblocking selected users
router.post('/unblock', async (req, res) => {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: 'No users selected' });
    }

    try {
        await db.query(
            `UPDATE users SET status = 'active' WHERE user_id IN (?)`,
            [userIds]
        );

        res.json({ message: 'Users unblocked' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// deleting selected users (real delete)
router.delete('/', async (req, res) => {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: 'No users selected' });
    }

    try {
        await db.query(
            `DELETE FROM users WHERE user_id IN (?)`,
            [userIds]
        );

        res.json({ message: 'Users deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;