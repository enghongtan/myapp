
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var userModel = require('./models/user');
var db = require('./db');

var AuthController = require('./auth/AuthController');
app.use('/api/v1', AuthController);

var UserController = require('./user/UserController');
app.use('/api/v1/', UserController);

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
