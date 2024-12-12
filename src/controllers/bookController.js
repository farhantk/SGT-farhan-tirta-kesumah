const Book = require('../models/book');
const { pool } = require('../config/database');

const getBooks = async (req, res) => {
    const client = await pool.connect();
    try {
        const { title, author, page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(400).json({ error: 'Invalid "page" parameter. Must be a positive integer.' });
        }
        if (isNaN(limitNumber) || limitNumber < 1) {
        return res.status(400).json({ error: 'Invalid "limit" parameter. Must be a positive integer.' });
        }

        const offset = (pageNumber - 1) * limitNumber;

        const filters = [];
        const values = [];
        if (title) {
            filters.push(`title LIKE $${filters.length + 1}`);
            values.push(`%${title}%`);
        }
        
        if (author) {
            filters.push(`author LIKE $${filters.length + 1}`);
            values.push(`%${author}%`);
        }
        
        await client.query('BEGIN');
        const total = await Book.countBooks(filters, values);
        const books = await Book.fetchBooks(filters, values, limitNumber, offset);
        const totalPages = Math.ceil(total / limitNumber);
        await client.query('COMMIT');

        res.json({
        data: books,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages,
        },
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error fetching books:', err.message); 
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

module.exports = { getBooks };
