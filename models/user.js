// ./models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userid: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    profilePic: String,
    department: String
}, {collection: 'users'});

module.exports = mongoose.model('User', UserSchema);
