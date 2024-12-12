const express = require('express');
const { borrowBook, returnBook } = require('../controllers/borrowingController');
const { validateBorrowing, validateReturnBook } = require('../validation/borrow'); 
const router = express.Router();

router.post('/', validateBorrowing, borrowBook);
router.put('/:id/return', validateReturnBook, returnBook);

module.exports = router; 