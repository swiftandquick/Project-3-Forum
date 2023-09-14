const { threadSchema, replySchema } = require("./schemas.js");

const ExpressError = require('./utils/ExpressError');

const Thread = require('./models/thread');
const Reply = require('./models/reply');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; 
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'You must sign out first!');
        return res.redirect('/threads');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

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

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const thread = await Thread.findById(id);
    if (!thread.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/threads/${id}`);
    }
    next();
}

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

module.exports.isReplyAuthor = async (req, res, next) => {
    const { id, replyId } = req.params;
    const reply = await Reply.findById(replyId);
    if (!reply.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/threads/${id}`);
    }
    next();
}
