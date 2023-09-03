const express = require('express');

// Use express router.  
const router = express.Router();

// Require passport.  
const passport = require('passport');

// Require the user model from models folder.  
const User = require('../models/user');

// Require files in utils folder.  
const catchAsync = require('../utils/catchAsync');

// Require the storeReturnTo function from middleware.js.  
const { storeReturnTo } = require('../middleware');

// Require the controller functions from controllers folder.  
const users = require('../controllers/users');

// GET route:  
// Register form page, localhost:3000/register.  
// POST route:  
// If there's an error, catchAsync will catch the error and the use method will be invoked.  
// When the form on localhost:3000/register.ejs is submitted, a post request is sent to localhost:3000/register.  
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

// GET route:  
// Login form page, localhost:3000/login.  
// POST route:  
// Use storeReturnTo as a middleware function.  
// Use passport as a middleware to authenticate, if login fails, flash a message and redirect back to localhost:3000/login.  
router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login);

// localhost:3000/logout logs the user out.  
router.get('/logout', users.logout); 

module.exports = router;