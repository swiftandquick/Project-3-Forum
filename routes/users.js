const express = require('express');

const { isLoggedIn, isLoggedOut } = require("../middleware");

const router = express.Router();

const passport = require('passport');

const catchAsync = require('../utils/catchAsync');

const { storeReturnTo } = require('../middleware');

const users = require('../controllers/users');

router.route('/register')
    .get(isLoggedOut, users.renderRegister)
    .post(isLoggedOut, catchAsync(users.register));

router.route('/login')
    .get(isLoggedOut, users.renderLogin)
    .post(isLoggedOut, storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login);

router.get('/logout', isLoggedIn, users.logout); 

module.exports = router;
