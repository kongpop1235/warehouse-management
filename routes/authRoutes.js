const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
    '/register',
    [
        check('username', 'Please enter a valid username').not().isEmpty(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    authController.register
);

router.post('/login', authController.login);

module.exports = router;
