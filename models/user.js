// Require packages.  
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Create a schema.  
const Schema = mongoose.Schema;

// Create a schema for users, which include email as a unique string.   
const UserSchema = new Schema({
    email: {
        type: String, 
        required: true, 
        unique: true
    }
});

// Use passportLocalMongoose to add username and password to the schema.  
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);