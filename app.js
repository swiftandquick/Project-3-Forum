// If I am not in production mode, require dotenv and config the file.  
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Require packages.  
const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');

const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')

// Require files in utils folder.  
const ExpressError = require('./utils/ExpressError');

// Require the model exported from module in user.js.  
const User = require('./models/user');

// Require the routes from the routes folder.  
const threadRoutes = require('./routes/threads');
const replyRoutes = require('./routes/replies');
const userRoutes = require('./routes/users');

// Require connect-mongo package. 
const MongoStore = require("connect-mongo");

// Connect to MongoDB Atlas database.  If I can't access to .env file, use local database.  
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/coding-gurus';

// Connect to the database coding-gurus.  
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
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

// Use mongoSanitize to sanitize user-supplied data to prevent MongoDB Operator Injection.  
// $ is replaced by _, so I can't inject data into MongoDB.  
app.use(mongoSanitize({replaceWith: '_'}));

// If process.env is accessible, I will use the SECRET variable, otherwise, set secret to the default value.  
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

// Use the create method to create the store.  
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

// Create a sessionConfig object.  Each session has a cookie that stores the session ID.  
// Each session expires in a week.  
const sessionConfig = {
    store, 
    name: 'session',
    secret,
    resave: false, 
    saveUnitialized: true, 
    cookie: {
        httpOnly: true, 
        // secure: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// Use express-session as session middleware, provide sessionConfig as argument.  
app.use(session(sessionConfig));

// Use connect-flash as a middleware to display messages after a certain action is done.  
app.use(flash());

// Enable all middleware that helmet came with.  
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];

const connectSrcUrls = [
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Initialize the passport.   
app.use(passport.initialize());

// We need the passport.session() middleware if we want persistent login sessions.  Use this middleware after the session middleware.  
app.use(passport.session());

// Use static authenticate method of model in LocalStrategy (User).  
passport.use(new LocalStrategy(User.authenticate()));

// Serialize users into the session.  Store the user in the session.  
passport.serializeUser(User.serializeUser());

// Deserialize users out of the session.  Un-store the user out of the session.  
passport.deserializeUser(User.deserializeUser());

// Use connect-flash as a middleware.  
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// All addresses that begin with localhost:3000 will use the userRoutes route.  
app.use('/', userRoutes);

// All addresses that begin with localhost:3000/threads will use the threadRoutes route.  
app.use('/threads', threadRoutes);

// All addresses that begin with localhost:3000/threads/:id/replies will use the replyRoutes route.  
app.use('/threads/:id/replies', replyRoutes)

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
