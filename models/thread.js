const mongoose = require('mongoose');

const Reply = require('./reply');

const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: String, 
    content: String, 
    postTime: Date, 
    lastEditTime: Date,
    lastThreadUpdate: Date, 
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    replies: [{type: Schema.Types.ObjectId, ref: 'Reply'}]
});

ThreadSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Reply.deleteMany({
            _id: {
                $in: doc.replies
            }
        })
    }
});

module.exports = mongoose.model('Thread', ThreadSchema);
