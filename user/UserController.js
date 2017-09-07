var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('../auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var User = require('../models/user');

//-------------------------------------------------------------------------------
// RETURNS ALL THE USERS IN THE DATABASE
//-------------------------------------------------------------------------------
router.get('/users', VerifyToken, function (req, res) {

 if(!req.isAdmin) return res.status(401).send("Unauthorized");

    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

//-------------------------------------------------------------------------------
// GETS A SINGLE USER FROM THE DATABASE
//-------------------------------------------------------------------------------
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

//-------------------------------------------------------------------------------
// DELETES A USER FROM THE DATABASE
//-------------------------------------------------------------------------------
router.delete('/user/:id', VerifyToken, function (req, res) {

 console.log('Delete page parameters');
 if(!req.isAdmin) return res.status(401).send("Unauthorized");

 var delUserid= req.params.id;
 console.log('delete userid='+delUserid);

 User.findOneAndRemove({ userid: delUserid }, function(err, user) {

        if (err){
		console.log(err);
 		return res.status(500).send("There was a problem deleting the user.");
	}
        res.status(200).send("User: "+ user.username +" was deleted.");
    });
});

//-------------------------------------------------------------------------------
// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
//-------------------------------------------------------------------------------
router.put('/user/:id',  VerifyToken, function (req, res) {

 var updUserid= req.params.id;
 var newUsername= req.body.username;
 var newPassword= req.body.password;
 //var newAdmin= req.body.isAdmin;
 var newProfilePic= req.body.profilePic;
 var newDepartment= req.body.department;

 var hashedPassword = bcrypt.hashSync(req.body.password, 8);

 console.log('Update page parameters');
 console.log('userid='+updUserid);
 console.log('username='+newUsername);
 console.log('password='+newPassword);
 console.log('password='+hashedPassword);
 //console.log('admin='+newAdmin);
 console.log('profilePic='+newProfilePic);
 console.log('department='+newDepartment);
 
 if(!req.isAdmin && req.userid != updUserid ){
	console.log("Not authorized as isAdmin="+isAdmin+" own userid="+ req.userid+ " updateUserid="+updUserid);
	return res.status(401).send("Unauthorized")
 };

 if(req.isAdmin | req.userid == updUserid ) {

 	var query   = { userid: updUserid  }; 
 	var update  = { username: newUsername, password: hashedPassword, profilePic: newProfilePic, department: newDepartment}; 
 	var options = { new: true }; 
 	User.findOneAndUpdate(query, update, options, function(err, user){ 
        	if (err){
		 console.log(err);
		 return res.status(500).send("There was a problem updating the user.");
		}
        	res.status(200).send(user);
    });

 }

});


module.exports = router;
