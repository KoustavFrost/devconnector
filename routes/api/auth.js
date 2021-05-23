const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users')

const {
    check,
    validationResult
} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json(user);
    } catch (error) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
});

// @route   POST api/auth
// @desc    Authenticate users and get token
// @access  Public
router.post(
    '/', // API path
    [
        // Express validator here
        check('email', 'Please include a valid email address').isEmail(),
        check('password', 'Password is required').exists()

    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // If the user exists, send reply

            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // Return jwt
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {
                    expiresIn: 360000
                },
                (error, token) => {
                    if (error) throw error;
                    return res.json({ token })
                }
            );


        } catch (err) {
            // Handle the error
            console.error(err.message);
            return res.status(500).send('Server error');
        }

    }
);

module.exports = router;