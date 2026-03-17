const express = require('express');
const router = express.Router();
const {
    getUsers,
    updateUser,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.use(protect);
router.use(admin);

router.route('/users').get(getUsers);
router.route('/users/:id')
    .put(
        [
            body('email').optional().isEmail().withMessage('Please provide a valid email'),
            body('name').optional().notEmpty().withMessage('Name cannot be empty'),
            body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        ],
        validate,
        updateUser
    )
    .delete(deleteUser);

module.exports = router;
