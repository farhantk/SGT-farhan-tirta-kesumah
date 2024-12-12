const express = require('express');
const { register, getMemberBorrowingHistory } = require('../controllers/memberController');
const { validateRegisterMember, validateMemberBorrowingHistory } = require('../validation/member');

const router = express.Router();

router.post('/', validateRegisterMember, register);
router.get('/:id/borrowings', validateMemberBorrowingHistory, getMemberBorrowingHistory);


module.exports = router; 