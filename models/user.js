﻿// ./models/user.js

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userid: { type: Number, required: true, unique: true },
    username: { type: String, required: true},
    password: { type: String, required: true },
    isAdmin: Boolean,
    profilePic: String,
    department: String
}, {collection: 'users'});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);
