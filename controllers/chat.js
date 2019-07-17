const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User')
const errorHandler = require('../utils/errorHandler');

module.exports.getConversations = function (req, res, next) {
    // Only return one message from each conversation to display as snippet
    Conversation.find({ participants: req.user._id })
        .select('_id favorite')
        .exec(function (err, conversations) {
            console.log('conversations', conversations)
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            // Set up empty array to hold conversations + most recent message
            let fullConversations = [];
            if (conversations.length) {
                conversations.forEach(function (conversation) {
                    Message.find({ 'conversationId': conversation._id })
                        .sort('-createdAt')
                        .limit(1)
                        .populate({
                            path: "author",
                            select: "name"
                        })
                        .exec(function (err, message) {
                            message[0]['favorite'] = conversation.favorite;

                            if (err) {
                                res.send({ error: err });
                                return next(err);
                            }
                            fullConversations.push(message);

                            if (fullConversations.length === conversations.length) {
                                return res.status(200).json({ conversations: fullConversations });
                            }
                        });
                });
            } else {
                return res.status(200).json({ conversations: [] });
            }
        });
};

module.exports.getConversation = function (req, res, next) {
    Message.find({ conversationId: req.params.conversationId })
        .select('createdAt body author')
        .sort('createdAt')
        .populate({
            path: 'author',
            select: 'name'
        })
        .exec(function (err, messages) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            res.status(200).json({ conversation: messages });
        });
};

module.exports.newConversation = async function (req, res, next) {
    try {
        if (!req.params.recipient) {
            res.status(422).send({ error: 'Please choose a valid recipient for your message.' });
            return next();
        }

        if (!req.body.message) {
            res.status(422).send({ error: 'Please enter a message.' });
            return next();
        }

        const author = await User.findById(req.user._id)

        const conversation = await new Conversation({
            participants: [req.user._id, req.params.recipient],
            conversationAuthor: {
                id: author._id,
                name: author.name
            },
            favorite: false
        });

        await conversation.save(function (err, newConversation) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            const message = new Message({
                conversationId: newConversation._id,
                conversationName: req.body.name,
                conversationAuthor: newConversation.conversationAuthor,
                conversationRecipient: req.params.recipient,
                body: req.body.message,
                author: req.user._id,
                favorite: false
            });

            message.save(function (err, newMessage) {
                if (err) {
                    res.send({ error: err });
                    return next(err);
                }

                res.status(200).json({ message: 'Conversation started!', conversationId: conversation._id });
                return next();
            });

        });
    } catch (e) {
        errorHandler(res, e)
    }

};

module.exports.sendReply = function (req, res, next) {
    const reply = new Message({
        conversationId: req.params.conversationId,
        conversationName: req.body.conversationName,
        conversationAuthor: req.body.conversationAuthor,
        conversationRecipient: req.body.conversationRecipient,
        body: req.body.message,
        author: req.user._id
    });

    reply.save(function (err, sentReply) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        res.status(200).json(sentReply);
        return (next);
    });
};

module.exports.updateConversation = async function (req, res) {
    const updated = {
        favorite: req.body.favorite
    };

    try {
        const conversation = await Conversation.findOneAndUpdate(
            { _id: req.params.conversationId },
            { $set: updated },
            { new: true }
        );
        console.log('conversation', conversation)
        res.status(200).json(conversation);
    } catch (e) {
        errorHandler(res, e)
    }
};

// DELETE Route to Delete Conversation
module.exports.deleteConversation = function (req, res, next) {
    Conversation.findOneAndRemove(
        { '_id': req.params.conversationId }, function (err) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            res.status(200).json({ message: 'Conversation removed!' });
            return next();
        });
};

// PUT Route to Update Message
module.exports.updateMessage = function (req, res, next) {
    Conversation.find({
        $and: [
            { '_id': req.params.messageId }, { 'author': req.user._id }
        ]
    }, function (err, message) {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        message.body = req.body.message;

        message.save(function (err, updatedMessage) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            res.status(200).json({ message: 'Message updated!' });
            return next();
        });
    });
};


