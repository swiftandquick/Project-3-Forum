const express = require('express');

// Use express router.  Set mergeParams to true so I can change thread's values.  
const router = express.Router({ mergeParams: true });

// Require files in utils folder.  
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Require functions from middleware.js.  
const { validateReply, isLoggedIn, isReplyAuthor } = require('../middleware');

// Require the controller functions from controllers folder.  
const replies = require('../controllers/replies');

// Use isLoggedIn to authenticate users, user can only perform this action when logged in.  
// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// validateReply is a middleware function that validates the thread schema.  
// When a form is submitted on localhost:3000/threads/:id, a post request is sent to localhost:3000/threads/:id/replies.  
router.post('/', isLoggedIn, validateReply, catchAsync(replies.createReply));

// Use isLoggedIn to authenticate users, user can only perform this action when logged in.  
// Use isReplyAuthor to authorize users, only user that posted the content can perform this action.  
// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// If I delete a reply by clicking on the small delete button on localhost:3000/threads/:id, 
// a delete request will be sent to localhost:3000/threads/:id/replies/:replyId.  
router.delete('/:replyId', isLoggedIn, isReplyAuthor, catchAsync(replies.deleteReply));

// Export the router.  
module.exports = router;