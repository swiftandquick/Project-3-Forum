const Thread = require('../models/thread');

module.exports.index = async(req, res) => {
    const threads = await Thread.find({}).populate('author');
    threads.sort(function(a, b) {
        return b.lastThreadUpdate.getTime() - a.lastThreadUpdate.getTime();
    });
    res.render('threads/index', {threads});
}

module.exports.renderNewForm = (req, res) => {
    res.render('threads/new');
}

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

module.exports.updateThread = async(req, res) => {
    const { id } = req.params;
    const thread = await Thread.findByIdAndUpdate(id, { ...req.body.thread });
    thread.lastEditTime = new Date();
    await thread.save();
    req.flash('success', 'Successfully edited the thread.');
    res.redirect(`/threads/${thread._id}`);
}

module.exports.deleteThread = async(req, res) => {
    const { id } = req.params;
    await Thread.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the thread.');
    res.redirect('/threads');
}
