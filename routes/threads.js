const express = require('express');

// Use express router.  
const router = express.Router();

// Require files in utils folder.  
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Require functions on schemas.js.  
const { threadSchema } = require("../schemas.js");

// Require the models from models folder.  
const Thread = require('../models/thread');

// Middleware function to validate threadSchema.  
const validateThread = (req, res, next) => {
    const { error } = threadSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// Index page, localhost:3000/threads.  
// Find all campgrounds and render them in index.ejs of threads folder, pass in threads array as argument.  
// Sort the threads array by time from latest to earliest before passing threads into index.ejs.  
router.get('/', catchAsync(async(req, res) => {
    const threads = await Thread.find({});
    threads.sort(function(a, b) {
        return b.lastThreadUpdate.getTime() - a.lastThreadUpdate.getTime();
    });
    res.render('threads/index', {threads});
}));

// Create a thread, localhost:3000/threads/new.  
// When creating a thread, render new.ejs of threads folder.  
router.get('/new', (req, res) => {
    res.render('threads/new');
});

// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// validateThread is a middleware function that validates the thread schema.  
// When the form from localhost:3000/threads/new is submitted, this will post method be invoked.  
// Set the postTime, lastEditTime, and lastThreadUpdate to current time, which is the time when the thread is submitted. 
// Save the thread as the new object inside the threads table.  
// Redirect to the newly created thread.  
router.post('/', validateThread, catchAsync(async(req, res) => {
    const thread = new Thread(req.body.thread);
    thread.postTime = new Date();
    thread.lastEditTime = new Date();
    thread.lastThreadUpdate = new Date();
    await thread.save();
    res.redirect(`/threads/${thread._id}`);
}));

// Individual thread, localhost:3000/threads/:id.  :id is the thread's ID.  
// For example, the link can be http://localhost:3000/threads/64e3fc4984cd83ab455ca60c.  
// Populate the replies array of objects so we can display the property replyContent for each reply object.  
// Render a specific thread based on ID, on show.ejs of threads folder.  
router.get('/:id', catchAsync(async(req, res) => {
    const thread = await Thread.findById(req.params.id).populate('replies');
    res.render('threads/show', { thread });
}));

// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// Edit the thread, localhost:3000/threads/:id/edit.  :id is the thread's ID.  
// Find the thread by the ID.  
// Pass the thread object into edit.ejs of threads folder.  
router.get('/:id/edit', catchAsync(async(req, res) => {
    const thread = await Thread.findById(req.params.id);
    res.render('threads/edit', { thread });
}));

// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// validateThread is a middleware function that validates the thread schema.  
// When the edit form is submitted on localhost:3000/threads/:id/edit, this PUT method is invoked.  
// Set the thread's lastEditTime to now.  
// After the edit thread form is submitted, redirect to localhost:3000/threads/:id.  
router.put('/:id', validateThread, catchAsync(async(req, res) => {
    const { id } = req.params;
    const thread = await Thread.findByIdAndUpdate(id, {...req.body.thread});
    thread.lastEditTime = new Date();
    await thread.save();
    res.redirect(`/threads/${thread._id}`);
}));

// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// When the delete form is submitted on localhost:3000/threads/:id, this DELETE method is invoked.  
// Delete the thread from the database.  
// Redirect to localhost:3000/threads after deletion.  
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Thread.findByIdAndDelete(id);
    res.redirect('/threads');
});

// Export the router.  
module.exports = router;