const validator = require('validator');

const validateBorrowing = (req, res, next) => {
    const { book_id, member_id } = req.body;

    if (!validator.isUUID(book_id)) {
        return res.status(400).json({ error: 'Invalid book_id. Must be a valid UUID.' });
    }
    if (!validator.isUUID(member_id)) {
        return res.status(400).json({ error: 'Invalid member_id. Must be a valid UUID.' });
    }

    next();
};

const validateReturnBook = (req, res, next) => {
    const { id } = req.params;

    if (!validator.isUUID(id)) {
        return res.status(400).json({ error: 'Invalid borrowing ID. Must be a valid UUID.' });
    }

    next();
};

module.exports = { validateBorrowing, validateReturnBook };
