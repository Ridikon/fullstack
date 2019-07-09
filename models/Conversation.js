const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema  = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'users'}],
    conversationAuthor: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('conversation', conversationSchema);
