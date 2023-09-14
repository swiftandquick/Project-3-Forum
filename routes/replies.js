const express = require('express');

const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { validateReply, isLoggedIn, isReplyAuthor } = require('../middleware');

const replies = require('../controllers/replies');

router.post('/', isLoggedIn, validateReply, catchAsync(replies.createReply));

router.delete('/:replyId', isLoggedIn, isReplyAuthor, catchAsync(replies.deleteReply));

module.exports = router;
