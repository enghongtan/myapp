
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

var whitelist = ['http://localhost:8080', 'http://35.197.155.91:8080'];
var corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    callback(null, true)
    /*
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }*/
  }, credentials: true
}

var bodyParser = require('body-parser');
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var userModel = require('./models/user');
var db = require('./db');

var AuthController = require('./auth/AuthController');
app.use('/api/v1', AuthController);

var UserController = require('./user/UserController');
app.use('/api/v1/', UserController);

var PrefController = require('./user/SearchPrefController');
app.use('/api/v1/', PrefController);

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
