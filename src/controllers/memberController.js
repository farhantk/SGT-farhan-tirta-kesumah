const Member = require('../models/member');
const { pool } = require('../config/database');


const register = async (req, res) => {
    const client = await pool.connect(); 
    try {
        await client.query('BEGIN');
        const { name, email, phone, address } = req.body;

        const emailExists = await Member.isEmailExists(email);
        if (emailExists) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Email already exists.' });
        }

        const newMember = await Member.createMember(name, email, phone, address);
        await client.query('COMMIT');
        res.status(201).json({
            message: 'Member registered successfully.',
            data: newMember,
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error registering member:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release(); 
    }
};

const getMemberBorrowingHistory = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params; 
        const { status, page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({ error: 'Invalid "page" parameter. Must be a positive integer.' });
        }
        if (isNaN(limitNumber) || limitNumber < 1) {
            return res.status(400).json({ error: 'Invalid "limit" parameter. Must be a positive integer.' });
        }
        await client.query('BEGIN');
        const { borrowings, total, totalPages } = await Member.getMemberBorrowingHistory(id, status, pageNumber, limitNumber);
        await client.query('COMMIT');
        res.json({
            data: borrowings,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages,
            },
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error fetching member borrowing history:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

module.exports = { register, getMemberBorrowingHistory };
