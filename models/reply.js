// Require packages.  
const mongoose = require('mongoose');

// Create a schema.  
const Schema = mongoose.Schema;

// Create a schema for replies, which include replyContent as string, 
// author is the User object, which is the user that created the reply, 
// replypostTime as date, which indicates when the reply was made, 
// replyLastEditTime as date, which indicates when the reply was last edited. 
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