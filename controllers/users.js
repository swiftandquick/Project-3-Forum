// Require the user model from models folder.  
const User = require('../models/user');

// Render register.ejs in users folder.  
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

// Create a new user object base on the information submitted from the form.  
// If I successfully create a user, log the user in, redirect to localhost:3000/threads and flash a success message.  
// If I failed to create a user, such as due to duplicated username, redirect to localhost:3000/register and flash an error message.   
module.exports.register = async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) {
                return next(err);
            }            
            req.flash('success', 'Welcome to Coding Gurus!');
            res.redirect('/threads');
        });
    }
    catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

// Render login.ejs in users folder.  
module.exports.renderLogin = (req, res) => {
    res.render('users/Login');
}

// If I successfully login, flash a success message and redirect to localhost:3000/threads or the session that I am currently in.  
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/threads';
    res.redirect(redirectUrl);
}

// Logs the user out.  
// Redirect to localhost:3000/threads.  
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/threads');
    });
}