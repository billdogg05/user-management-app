const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// registering new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        // hashing password
        const passwordHash = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users
            (first_name, last_name, user_email, password_hash, status, last_login_datetime)
            VALUES (?, ?, ?, ?, 'unverified', NOW())`,
            [firstName, lastName, email, passwordHash]
        );

        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }

        res.status(500).json({ message: 'Server error' });
    }
});

// login existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const [rows] = await db.query(
            `SELECT user_id, password_hash, status
            FROM users
            WHERE user_email = ?`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        if (user.status === 'blocked') {
            return res.status(403).json({ message: 'User is blocked' });
        }

        // comparing hashed password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // updating last login time
        await db.query(
            `UPDATE users
            SET last_login_datetime = NOW()
            WHERE user_id = ?`,
            [user.user_id]
        );

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;