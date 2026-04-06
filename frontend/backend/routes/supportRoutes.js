const express = require('express');
const router = express.Router();
const { escalateToAgent } = require('../controllers/supportController');

// @route   POST /api/support/escalate
// @desc    Escalate a chat conversation to a support agent via email
// @access  Public
router.post('/escalate', escalateToAgent);

module.exports = router;
