const express = require('express');

// Use express router.  Set mergeParams to true so I can change thread's values.  
const router = express.Router({ mergeParams: true });

// Require files in utils folder.  
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Require functions on schemas.js.  
const { replySchema } = require("../schemas.js");

// Require the models from models folder.  
const Thread = require('../models/thread');
const Reply = require('../models/reply');

// Middleware function to validate threadReply.  
const validateReply = (req, res, next) => {
    const { error } = replySchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// validateReply is a middleware function that validates the thread schema.  
// When a form is submitted on localhost:3000/threads/:id, a post request is sent to localhost:3000/threads/:id/replies.  
// Set the replyPostTime, replyLastEditTime for reply as well as lastThreadUpdate for thread to current time, which is the time when the thread is submitted. 
// Retrieve the information from the submitted form to create a reply object, then add the reply object to the current thread's replies array property.  
// Redirect to the show page of the current thread at localhost:3000/threads/:id.  
router.post('/', validateReply, catchAsync(async(req, res) => {
    const thread = await Thread.findById(req.params.id);
    const reply = new Reply(req.body.reply);
    reply.replyPostTime = new Date();
    reply.replyLastEditTime = new Date();
    thread.lastThreadUpdate = new Date();
    thread.replies.push(reply);
    await reply.save();
    await thread.save();
    res.redirect(`/threads/${thread._id}`)
}));

// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// If I delete a reply by clicking on the small delete button on localhost:3000/threads/:id, 
// a delete request will be sent to localhost:3000/threads/:id/replies/:replyId.  
// The object with the corresponding reviewId will be removed from the current thread's replies array property.  
// The reply itself will also be removed from the database.  
// Redirect to localhost:3000/threads/:id after a form is submitted.  
router.delete('/:replyId', catchAsync(async(req, res) => {
    const { id, replyId } = req.params;
    await Thread.findByIdAndUpdate(id, { $pull: { replies: replyId }});
    await Reply.findByIdAndDelete(replyId);
    res.redirect(`/threads/${id}`);
}));

// Export the router.  
module.exports = router;