// Type in node seeds/index.js to seed the database.  

// Require packages.  
const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');

// Require the models from models folder.  
const Thread = require('../models/thread');
const Reply = require('../models/reply');

// Connect to the database coding-gurus.  
mongoose.connect('mongodb://127.0.0.1:27017/coding-gurus', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection open!");
    })
    .catch(error => {
        console.log("Error!");
        console.log(error);
});

// Delete all existing Thread and Reply objects.  Add a new Thread object into the database.  Create 10 threads.   
// Author is tim, the ID belongs to the user with username of 'tim'.  
const seedDB = async () => {
    await Thread.deleteMany({});
    await Reply.deleteMany({});
    for(let i = 0; i < 10; i++) {
        const t = new Thread({
            author: '64f37f551602b055abd90a36',
            title: 'Thread',
            content: 'This is a comment.', 
            postTime: new Date(), 
            lastEditTime: new Date(),
            lastThreadUpdate: new Date()
        });
        await t.save();
    }
}

seedDB();