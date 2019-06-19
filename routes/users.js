const express = require('express');
const passport = require('passport');
const controller = require('../controllers/users');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), controller.getUsers);
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.geById);
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update);

module.exports = router;
