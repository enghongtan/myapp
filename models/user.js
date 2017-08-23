// ./models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    firstname: String,
    lastname: String,
    password: String
}, {collection: 'users'});

module.exports = mongoose.model('User', UserSchema);
