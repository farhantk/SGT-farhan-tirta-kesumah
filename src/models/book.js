const pool = require('../config/database').pool;

const Book = {
  countBooks: async (filters, values) => {
    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const query = `SELECT COUNT(*) FROM books ${whereClause}`;
    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  },

  fetchBooks: async (filters, values, limit, offset) => {
    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    const query = `
      SELECT id, title, author, published_year, stock, isbn,
             CASE WHEN stock > 0 THEN true ELSE false END AS available
      FROM books
      ${whereClause}
      ORDER BY title ASC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    values.push(limit, offset);
    const result = await pool.query(query, values);
    return result.rows;
  },
};

module.exports = Book;
