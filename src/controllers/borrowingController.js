const Borrow = require('../models/borrowing');
const { pool } = require('../config/database');

const borrowBook = async (req, res) => {
    const client = await pool.connect();
    try {
        const { book_id, member_id } = req.body;
        await client.query('BEGIN');

        const bookStock = await Borrow.checkBookStock(book_id);
        if (bookStock <= 0) {
            return res.status(400).json({ error: 'Book is out of stock.' });
        }

        const borrowedBooksCount = await Borrow.checkMemberBorrowedBooks(member_id);
        if (borrowedBooksCount >= 3) {
            return res.status(400).json({ error: 'Member cannot borrow more than 3 books.' });
        }

        const updatedStock = await Borrow.subtractBookStock(book_id);
        if (updatedStock < 0) {
            return res.status(400).json({ error: 'Error updating book stock.' });
        }

        const newBorrowing = await Borrow.createBorrowing(book_id, member_id);
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Book borrowed successfully.',
            data: newBorrowing,
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error borrowing book:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release(); 
    }
};

const returnBook = async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const borrowing = await Borrow.getBorrowingById(id);

        if (borrowing.status === 'RETURNED') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Book has already been returned.' });
        }

        const updatedBorrowing = await Borrow.returnBook(id);

        const updatedStock = await Borrow.addBookStock(borrowing.book_id);


        res.status(200).json({
            message: 'Book returned successfully.',
            borrowing: updatedBorrowing,
            updatedStock: updatedStock,
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error returning book:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release(); 
    }
};

module.exports = { borrowBook, returnBook };
