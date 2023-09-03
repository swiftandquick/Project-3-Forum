// Require functions on schemas.js.  
const { threadSchema, replySchema } = require("./schemas.js");

// Require files in utils folder.  
const ExpressError = require('./utils/ExpressError');

// Require the models from models folder.  
const Thread = require('./models/thread');
const Reply = require('./models/reply');

// If I am not sign in and try to go to localhost:3000/threads/new, flash an error message and redirect to localhost:3000/login.  
// Otherwise, call next() and proceed.  
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; 
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

// Save the returnTo value from the session to res.locals.  
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// Middleware function to validate threadSchema.  
module.exports.validateThread = (req, res, next) => {
    const { error } = threadSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// If the author is not the author that created the thread, flash an error message and redirect to localhost:3000/threads/:id.  
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const thread = await Thread.findById(id);
    if (!thread.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/threads/${id}`);
    }
    next();
}

// Middleware function to validate threadReply.  
module.exports.validateReply = (req, res, next) => {
    const { error } = replySchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// If the author is not the author that created the reply, flash an error message and redirect to localhost:3000/threads/:id.  
module.exports.isReplyAuthor = async (req, res, next) => {
    const { id, replyId } = req.params;
    const reply = await Reply.findById(replyId);
    if (!reply.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/threads/${id}`);
    }
    next();
}