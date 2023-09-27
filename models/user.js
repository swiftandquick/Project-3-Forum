const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email.']
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
