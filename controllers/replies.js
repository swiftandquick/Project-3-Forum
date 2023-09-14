const Thread = require('../models/thread');
const Reply = require('../models/reply');

module.exports.createReply = async(req, res) => {
    const thread = await Thread.findById(req.params.id);
    const reply = new Reply(req.body.reply);
    reply.author = req.user._id;
    reply.replyPostTime = new Date();
    reply.replyLastEditTime = new Date();
    thread.lastThreadUpdate = new Date();
    thread.replies.push(reply);
    await reply.save();
    await thread.save();
    req.flash('success', 'Successfully created new reply.');
    res.redirect(`/threads/${thread._id}`)
}

module.exports.deleteReply = async(req, res) => {
    const { id, replyId } = req.params;
    await Thread.findByIdAndUpdate(id, { $pull: { replies: replyId }});
    await Reply.findByIdAndDelete(replyId);
    req.flash('success', 'Successfully deleted the reply.');
    res.redirect(`/threads/${id}`);
}
