var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var VerifyToken = require('../auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var User = require('../models/user');

//-------------------------------------------------------------------------------
// RETURNS ALL THE USERS IN THE DATABASE
// http://localhost:3000/api/v1/users?username=John&userid=0&page=0&limit=2
//-------------------------------------------------------------------------------
router.get('/users', VerifyToken, function (req, res) {

 if(!req.isAdmin) return res.status(401).send("Unauthorized. Not an Administrator");

 var usrName= req.query.username;
 var usrid= req.query.userid;

 var limitPerPage= req.query.limit > 0 ? req.query.limit : 0;
 var limitNum= parseInt(limitPerPage,10);

 var pageNum = req.query.page > 0 ? req.query.page : 1;

 console.log('Search page parameters');
 console.log('username= '+usrName);
 console.log('userid= '+usrid);
 console.log('page= '+pageNum);
 console.log('limitPerPage= '+limitNum);

 var query;
 if (usrName == 'all' && usrid == '0') {
 	 console.log('Search using all');
	 query= {};
 }
 else if (usrName == 'all' && usrid > 0){
 	 console.log('Search using userid');
	 query= {userid: usrid};
 }
  else if (usrName != 'all' && usrid == '0'){
	 console.log('Search using username');
	 query= {username: usrName};
 }
 User.paginate(query, { select: 'userid username password isAdmin profilePic department', page: pageNum, limit: limitNum},  function (err, users) {

 if (err){
		console.log(err);
	 	return res.status(500).send("There was a problem searching users.");
	}
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

 var delUserid= req.params.id;
 console.log('delete userid= '+delUserid);
 console.log('own userid= '+req.userid);

 if(!req.isAdmin) return res.status(401).send("Unauthorized. Not an Administrator");

 //check to prevent self delete
 if(req.isAdmin | req.userid == delUserid ) {
	console.log('Unauthorized as cannot delete self');
	return res.status(401).send("Unauthorized. Cannot delete self");
 }

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
	return res.status(401).send("Unauthorized.  Not an Administrator or not your particulars")
 };

 if(req.isAdmin | req.userid == updUserid ) {

 	var query   = { userid: updUserid  };
 	var update  = {};
  if(!!newUsername) update = Object.assign({}, update, {username: newUsername});
  if(!!newProfilePic) update = Object.assign({}, update, {profilePic: newProfilePic});
  if(!!hashedPassword) update = Object.assign({}, update, {password: hashedPassword});
  if(!!newDepartment) update = Object.assign({}, update, {department: newDepartment});

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


//-------------------------------------------------------------------------------
// UPDATES USER SEARCH PREFERENCE IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
//-------------------------------------------------------------------------------
router.put('/userpref/:id',  VerifyToken, function (req, res) {


});
module.exports = router;
