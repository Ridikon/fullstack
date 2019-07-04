const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema  = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'users'}],
    authorName: {
        type: String
    }
});

module.exports = mongoose.model('conversation', conversationSchema);
