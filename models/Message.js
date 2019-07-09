const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
        conversationId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        conversationName: {
            type: String,
            required: true
        },
        conversationAuthor: {
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        },
        conversationRecipient: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    });

module.exports = mongoose.model('message', MessageSchema);
