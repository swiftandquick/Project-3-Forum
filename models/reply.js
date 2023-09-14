const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const replySchema = new Schema({
    replyContent: String,
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    replyPostTime: Date, 
    replyLastEditTime: Date
});

module.exports = mongoose.model("Reply", replySchema);
