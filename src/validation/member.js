const validator = require('validator');

const validateRegisterMember = (req, res, next) => {
    const { name, email, phone, address } = req.body;

    if (!name || typeof name !== 'string' || !validator.isAlpha(name.replace(/ /g, ''))) {
      return res.status(400).json({ error: 'Name is required and must be a string.' });
    }

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!phone || !validator.matches(phone, /^[0-9]{10,15}$/)) {
      return res.status(400).json({ error: 'Phone must be 10-15 digits long.' });
    }

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address is required and must be a string.' });
    }

    next();
};

const validateMemberBorrowingHistory = (req, res, next) => {
    const { id } = req.params;
    const { status, page, limit } = req.query;

    if (!validator.isUUID(id)) {
        return res.status(400).json({ error: 'Invalid member ID. Must be a valid UUID.' });
    }

    if (status && !['BORROWED', 'RETURNED'].includes(status)) {
        return res.status(400).json({ error: 'Status must be either BORROWED or RETURNED' });
    }

    if (page && !validator.isInt(page, { min: 1 })) {
        return res.status(400).json({ error: 'Page must be a positive integer.' });
    }

    if (limit && !validator.isInt(limit, { min: 1 })) {
        return res.status(400).json({ error: 'Limit must be a positive integer.' });
    }

    next();
};

module.exports = { validateRegisterMember, validateMemberBorrowingHistory };
