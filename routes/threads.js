const express = require('express');

// Use express router.  
const router = express.Router();

// Require files in utils folder.  
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// Import the middleware function isLoggedIn to authenticate the users.  
const { isLoggedIn, validateThread, isAuthor } = require("../middleware");

// Require the controller functions from controllers folder.  
const threads = require('../controllers/threads');

// GET route:  
// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// Index page, localhost:3000/threads.  
// POST route:  
// Use isLoggedIn to authenticate users, user can only perform this action when logged in.  
// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// validateThread is a middleware function that validates the thread schema.  
// When the form from localhost:3000/threads/new is submitted, this will post method be invoked.  
router.route('/')
    .get(catchAsync(threads.index))
    .post(isLoggedIn, validateThread, catchAsync(threads.createThread));

// Use isLoggedIn to authenticate users, user can only perform this action when logged in.  
// the /new route needs to be before the :id route, otherwise express thinks new is a ID.  
// Create a thread, localhost:3000/threads/new.  
router.get('/new', isLoggedIn, threads.renderNewForm);

// GET route:
// Individual thread, localhost:3000/threads/:id.  :id is the thread's ID.  
// For example, the link can be http://localhost:3000/threads/64e3fc4984cd83ab455ca60c.  
// PUT route:  
// Use isLoggedIn to authenticate users, user can only perform this action when logged in.  
// Use isAuthor to authorize users, only user that posted the content can perform this action.  
// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// validateThread is a middleware function that validates the thread schema.  
// When the edit form is submitted on localhost:3000/threads/:id/edit, this PUT method is invoked.  
// DELETE route:  
// Use isLoggedIn to authenticate users, user can only perform this action when logged in.  
// Use isAuthor to authorize users, only user that posted the content can perform this action.  
// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// When the delete form is submitted on localhost:3000/threads/:id, this DELETE method is invoked.  
router.route('/:id')
    .get(catchAsync(threads.showThread))
    .put(isLoggedIn, isAuthor, validateThread, catchAsync(threads.updateThread))
    .delete(isLoggedIn, isAuthor, threads.deleteThread);

// Use isLoggedIn to authenticate users, user can only perform this action when logged in.  
// Use isAuthor to authorize users, only user that posted the content can perform this action.  
// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// Edit the thread, localhost:3000/threads/:id/edit.  :id is the thread's ID.  
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(threads.renderEditForm));

// Export the router.  
module.exports = router;