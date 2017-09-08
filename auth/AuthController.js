var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../models/user');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../config'); // get config file

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
router.post('/login', function(req, res) {

  console.log('userid='+req.body.userid);

  User.findOne({ userid: req.body.userid }, function (err, user) {
    if (err) {
        console.log(err);
	return res.status(500).send('Error on the server.');
    }
    if (!user) return res.status(404).send('No user found.');
	console.log('------');
    console.log(user);
   console.log('body'+req.body.password);
   console.log('user'+user.password);

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user.userid, isAdmin: user.isAdmin }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    // return the information including token as JSON
    res.status(200).cookie('x-access-token', token, {httpOnly: true}).send({ auth: true, token: token });
  });

});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

//-------------------------------------------------------------------------------
// Create a new user
//-------------------------------------------------------------------------------
router.post('/user', VerifyToken, function(req, res) {

 if(!req.isAdmin) return res.status(401).send("Unauthorized");

 var newUserid=req.body.userid;
 var newUsername= req.body.username;
 var newPassword= req.body.password;
 var newAdmin= req.body.isAdmin;
 var newProfilePic= req.body.profilePic;
 var newDepartment= req.body.department;

 var hashedPassword = bcrypt.hashSync(req.body.password, 8);

 console.log('Create page parameters');

 console.log('username='+newUsername);
 console.log('userid='+newUserid);
 console.log('password='+hashedPassword);
 console.log('password='+newPassword);
 console.log('admin='+newAdmin);
 console.log('profilePic='+newProfilePic);
 console.log('department='+newDepartment);

  User.create({
 	userid: newUserid,
	username: newUsername,
	password: hashedPassword,
	isAdmin: newAdmin,
	profilePic: newProfilePic,
	department: newDepartment
  },
  function (err, user) {
    if (err) {
	console.log("ERROR: " +err);
	return res.status(500).send("There was a problem registering the user`.");
}

    res.status(200).json({username: user.username});
  });

});

//-------------------------------------------------------------------------------
// Get self
//-------------------------------------------------------------------------------
router.get('/user', VerifyToken, function(req, res, next) {
	console.log(req.userId);
  User.findOne({userid: req.userId}, {password: 0, _id: 0, __v: 0}, function (err, user) {
    if (err) {
	console.log(err);
	return res.status(500).send("There was a problem finding the user.");
    }
    if (!user) return res.status(404).send("No user found.");
    res.status(200).json(user);
  });

});

module.exports = router;
