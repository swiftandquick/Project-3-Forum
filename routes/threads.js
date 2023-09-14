const express = require('express');

const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { isLoggedIn, validateThread, isAuthor } = require("../middleware");

const threads = require('../controllers/threads');

router.route('/')
    .get(catchAsync(threads.index))
    .post(isLoggedIn, validateThread, catchAsync(threads.createThread));

router.get('/new', isLoggedIn, threads.renderNewForm);

router.route('/:id')
    .get(catchAsync(threads.showThread))
    .put(isLoggedIn, isAuthor, validateThread, catchAsync(threads.updateThread))
    .delete(isLoggedIn, isAuthor, threads.deleteThread);

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(threads.renderEditForm));

module.exports = router;
