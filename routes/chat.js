const express = require('express');
const passport = require('passport');
const controller = require('../controllers/chat');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), controller.getConversations);
router.get('/:conversationId', passport.authenticate('jwt', {session: false}), controller.getConversation);
router.post('/:conversationId', passport.authenticate('jwt', {session: false}), controller.sendReply);
router.post('/new/:recipient', passport.authenticate('jwt', {session: false}), controller.newConversation);
router.delete('/:conversationId', passport.authenticate('jwt', {session: false}), controller.deleteConversation);
router.patch('/:conversationId', passport.authenticate('jwt', {session: false}), controller.updateConversation);

module.exports = router;
