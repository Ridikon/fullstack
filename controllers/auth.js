const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});

    if (candidate) {
        // Checking password, user exist
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            // Generate token, passwords is compared
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60});

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            // Passwords is not compared
            res.status(401).json({
                message: 'Паролі не співпали. Спробуйте знову.'
            })
        }
    } else {
        // User not found, error
        res.status(404).json({
            message: 'Користувача з таким email не знайдено.'
        })
    }
};

module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email});

    if (candidate) {
        // User exist, need fired an error
        res.status(409).json({
            message: 'Такий email вже зайнятий. Спробуйте інший.'
        })
    } else {
        // Need create new user
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user =  new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });

        try {
            await user.save();
            res.status(201).json(user)
        } catch (e) {
            // If error
            errorHandler(res, e)
        }
    }
};
