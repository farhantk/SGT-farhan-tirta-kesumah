const pool = require('../config/database').pool;

const Member = {
    createMember: async (name, email, phone, address) => {
        const query = `
        INSERT INTO members (name, email, phone, address)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, phone, address;
        `;
        const values = [name, email, phone, address];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    isEmailExists: async (email) => {
        const query = 'SELECT COUNT(*) FROM members WHERE email = $1';
        const result = await pool.query(query, [email]);
        return parseInt(result.rows[0].count, 10) > 0;
    },

    getMemberBorrowingHistory: async (memberId, status, page, limit) => {
        const offset = (page - 1) * limit;
        let statusFilter = '';
        const values = [memberId];

        if (status) {
            if (status !== 'BORROWED' && status !== 'RETURNED') {
                throw new Error('Invalid status. Must be BORROWED or RETURNED.');
            }
            statusFilter = `AND status = $2`;
            values.push(status); 
        }

        const totalQuery = `
            SELECT COUNT(*) 
            FROM borrowings 
            WHERE member_id = $1 ${statusFilter}`;
        
        const totalResult = await pool.query(totalQuery, values);
        const total = parseInt(totalResult.rows[0].count, 10);

        const borrowingsQuery = `
            SELECT b.id, b.borrow_date, b.return_date, b.status, bk.title, bk.author, bk.published_year
            FROM borrowings b
            JOIN books bk ON b.book_id = bk.id
            WHERE b.member_id = $1 ${statusFilter}
            ORDER BY b.borrow_date DESC
            LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        
        values.push(limit, offset);

        const borrowingsResult = await pool.query(borrowingsQuery, values);
        const borrowings = borrowingsResult.rows;

        const totalPages = Math.ceil(total / limit);

        return { borrowings, total, totalPages };
    }
};

module.exports = Member;
