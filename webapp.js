
const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var User = require('./models/user');

var mongodb = require("mongodb");
var ObjectId = require('mongodb').ObjectId;

var url= 'mongodb://localhost/usrmgmtdb';
var db;

var mongoose = require('mongoose');
mongoose.connect(url);
var COLLECTION = 'users';


function handleError(res, reason, message, code) {
console.log("ERROR: " + reason);
res.status(code || 500).json({"error": message});
}


app.listen(3000, function() {
  console.log('listening on 3000')
})


app.get('/', function (req, res) {
  res.status(200).send('Working!')
})

//PLACEHOLDER FUNCTION TO FIND ALL USERS
app.get('/api/users', function(req, res) {
 User.find({}, function(err, users) {
    if (err) {
     handleError(res, err.message, "Failed to get users.");
    }else{
     res.status(200).json(users);
    }
  });
});

//PLACEHOLDER FUNCTION TO FIND ALL USERS AND RETURN USERNAMES
app.get('/api/user_ids', function(req, res) {
 User.find({}, 'username', function(err, users) {
    if (err) {
     handleError(res, err.message, "Failed to get users.");
    }else{
     res.status(200).json(users);
    }
  });
});

//PLACEHOLDER FUNCTION TO FIND 1 USER BY USERNAME
app.get('/api/users/:id', function(req, res) {
 User.find({ username: req.params.id }, function(err,users) {
    if (err) {
     handleError(res, err.message, "Failed to get user.");
    }else{
     //console.log(req.params.id);
     res.status(200).json(users);
    }
 });
});




