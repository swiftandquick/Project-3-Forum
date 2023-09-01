// Require packages.  
const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');

const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

// Require files in utils folder.  
const ExpressError = require('./utils/ExpressError');

// Require the routes from the routes folder.  
const threads = require('./routes/threads');
const replies = require('./routes/replies');

// Connect to the database coding-gurus.  
mongoose.connect('mongodb://127.0.0.1:27017/coding-gurus', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection open!");
    })
    .catch(error => {
        console.log("Error!");
        console.log(error);
});

// Use ejs-mate on ejs files.  
app.engine('ejs', ejsMate);

// Set the view engine to ejs, so we use ejs files for front end layout instead of html files.  
app.set('view engine', 'ejs');

// __dirname is the current directory of app.js, if I use the join method, I set views directory to the views folder regardless of where I am currently at.  
app.set('views', path.join(__dirname, 'views'));

// Use this line of code so I can link the the bootstrap styling to boilerplate.ejs.  
app.use(express.static(path.join(__dirname, 'public')));

// This line of code allows me to parse req.body.  
app.use(express.urlencoded({ extended: true }));

// The query string for overriding methods is "_method".  
app.use(methodOverride('_method'));

// All addresses that begin with localhost:3000/threads will use the threads route.  
app.use('/threads', threads);

// All addresses that begin with localhost:3000/threads/:id/replies will use the replies route.  
app.use('/threads/:id/replies', replies)

// Home page, localhost:3000.  
// Render the home.ejs view when I a on the main page.  
app.get('/', (req, res) => {
    res.render('home');
});

// Order is important.  This will only run if nothing else is match first.  
// If I go to localhost:3000/naruto, I will get an error message because the page doesn't exist.  
// The use method to render error will be invoked if I go to a non-existent page, error message is "Page not found!", statusCode is 404.  
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
});

// Handle errors, such as go to a page that doesn't exist or open a thread with the wrong id.  
// Render the error on error.ejs.  
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong!";
    } 
    res.status(statusCode).render('error', { err });
});

// The local app will be listened on port 3000.  The address on the server should be http://localhost:3000/.  
app.listen(3000, () => {
    console.log("Serving on port 3000...");
});