
//var mongodb = require("mongodb");
//var ObjectId = require('mongodb').ObjectId;


var url= 'mongodb://localhost/user';
//var db;

var mongoose = require('mongoose');
mongoose.connect(url, { useMongoClient: true });
//db = mongoose.createConnection(url);

//Bind connection to error event (to get notification of connection errors)
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));




