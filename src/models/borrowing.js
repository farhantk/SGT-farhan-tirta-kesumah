const pool = require('../config/database').pool;

const Borrow = {
    checkBookStock: async (bookId) => {
        const query = 'SELECT stock FROM books WHERE id = $1';
        const result = await pool.query(query, [bookId]);
        if (result.rows.length === 0) {
            throw new Error('Book not found');
        }
        return result.rows[0].stock;
    },

    subtractBookStock: async (bookId) => {
        const query = 'UPDATE books SET stock = stock - 1 WHERE id = $1 RETURNING stock';
        const result = await pool.query(query, [bookId]);
        return result.rows[0].stock;
    },

    checkMemberBorrowedBooks: async (memberId) => {
        const query = 'SELECT COUNT(*) FROM borrowings WHERE member_id = $1 AND return_date IS NULL';
        const result = await pool.query(query, [memberId]);
        return parseInt(result.rows[0].count, 10);
    },

    createBorrowing: async (bookId, memberId) => {
        const borrowingDate = new Date();
        const query = `
            INSERT INTO borrowings (book_id, member_id, borrow_date) 
            VALUES ($1, $2, $3) 
            RETURNING *`;
        const result = await pool.query(query, [bookId, memberId, borrowingDate]);
        return result.rows[0];
    },

    getBorrowingById: async (borrowingId) => {
        const query = 'SELECT * FROM borrowings WHERE id = $1';
        const result = await pool.query(query, [borrowingId]);
        if (result.rows.length === 0) {
            throw new Error('Borrowing record not found');
        }
        return result.rows[0];
    },

    returnBook: async (borrowingId) => {
        const returnDate = new Date();
        
        const query = `
            UPDATE borrowings
            SET status = 'RETURNED', return_date = $1
            WHERE id = $2
            RETURNING *`;
        const result = await pool.query(query, [returnDate, borrowingId]);
        return result.rows[0];
    },

    addBookStock: async (bookId) => {
        const query = 'UPDATE books SET stock = stock + 1 WHERE id = $1 RETURNING stock';
        const result = await pool.query(query, [bookId]);
        return result.rows[0].stock;
    }
}

module.exports = Borrow;
