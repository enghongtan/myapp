// ./models/userPref.js

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var UserPrefSchema = new Schema({
    userid: { type: Number, required: true, unique: true },
    searchPref: Schema.Types.Mixed
}, {collection: 'userSearchPref'});

//UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('UserPref', UserPrefSchema);