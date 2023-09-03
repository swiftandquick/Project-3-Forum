// Require the models from models folder.  
const Thread = require('../models/thread');

// Populate the author object so we can display the object properties.
// Find all campgrounds and render them in index.ejs of threads folder, pass in threads array as argument.  
// Sort the threads array by time from latest to earliest before passing threads into index.ejs.  
module.exports.index = async(req, res) => {
    const threads = await Thread.find({}).populate('author');
    threads.sort(function(a, b) {
        return b.lastThreadUpdate.getTime() - a.lastThreadUpdate.getTime();
    });
    res.render('threads/index', {threads});
}

// When creating a thread, render new.ejs of threads folder.  
module.exports.renderNewForm = (req, res) => {
    res.render('threads/new');
}

// Set the postTime, lastEditTime, and lastThreadUpdate to current time, which is the time when the thread is submitted. 
// Set the user as the user that's currently logged in.  
// Save the thread as the new object inside the threads table.  
// Flash a success message if I successfully make a new thread.  
// Redirect to the newly created thread.  
module.exports.createThread = async(req, res) => {
    const thread = new Thread(req.body.thread);
    thread.postTime = new Date();
    thread.lastEditTime = new Date();
    thread.lastThreadUpdate = new Date();
    thread.author = req.user._id;
    await thread.save();
    req.flash('success', 'Successfully made a new thread.');
    res.redirect(`/threads/${thread._id}`);
}

// Populate the author object and the replies array of objects so we can display the object properties.  
// If thread doesn't exist, flash an error message and redirect to the index page.  
// If thread does exist, render a specific thread based on ID, on show.ejs of threads folder.  
module.exports.showThread = async(req, res) => {
    const thread = await Thread.findById(req.params.id).populate({
        path: 'replies',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!thread) {
        req.flash('error', 'Thread not found!');
        res.redirect('/threads');
    }
    else {
        res.render('threads/show', { thread });
    }
}

// If the thread is not found, redirect back to localhost:3000/threads.  
// Otherwise, render edit.ejs.  
module.exports.renderEditForm = async(req, res) => {
    const thread = await Thread.findById(req.params.id);
    if(!thread) {
        req.flash('error', 'Thread not found!');
        res.redirect('/threads');
    }
    else {
        res.render('threads/edit', { thread });
    }
}

// Set the thread's lastEditTime to now.  
// Flash a success message if I successfully edited a new thread.  
// After the edit thread form is submitted, redirect to localhost:3000/threads/:id.  
module.exports.updateThread = async(req, res) => {
    const { id } = req.params;
    const thread = await Thread.findByIdAndUpdate(id, { ...req.body.thread });
    thread.lastEditTime = new Date();
    await thread.save();
    req.flash('success', 'Successfully edited the thread.');
    res.redirect(`/threads/${thread._id}`);
}

// Delete the thread from the database.  
// Flash a success message if I successfully deleted a new thread.  
// Redirect to localhost:3000/threads after deletion.  
module.exports.deleteThread = async(req, res) => {
    const { id } = req.params;
    await Thread.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the thread.');
    res.redirect('/threads');
}