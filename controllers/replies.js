// Require the models from models folder.  
const Thread = require('../models/thread');
const Reply = require('../models/reply');

// Set the author to the author that's currently logged in.  
// Set the replyPostTime, replyLastEditTime for reply as well as lastThreadUpdate for thread to current time, which is the time when the thread is submitted. 
// Retrieve the information from the submitted form to create a reply object, then add the reply object to the current thread's replies array property.  
// Flash a success message if I successfully make a new reply.  
// Redirect to the show page of the current thread at localhost:3000/threads/:id.  
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

// The object with the corresponding reviewId will be removed from the current thread's replies array property.  
// The reply itself will also be removed from the database.  
// Flash a success message if I successfully delete a reply.  
// Redirect to localhost:3000/threads/:id after a form is submitted.  
module.exports.deleteReply = async(req, res) => {
    const { id, replyId } = req.params;
    await Thread.findByIdAndUpdate(id, { $pull: { replies: replyId }});
    await Reply.findByIdAndDelete(replyId);
    req.flash('success', 'Successfully deleted the reply.');
    res.redirect(`/threads/${id}`);
}