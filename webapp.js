
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
app.use(cookieParser());
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

//-------------------------------------------------------------------------------
//PLACEHOLDER FUNCTION TO FIND ALL USERS
// http://localhost:3000/api/v1/users?username=John&userid=0&page=0&limit=2
//-------------------------------------------------------------------------------
app.get('/api/v1/kivusers', function(req, res) {

 var usrName= req.query.username;
 var userid= req.query.userid; 

 var limitPerPage= req.query.limit > 0 ? req.query.limit : 0;
 var limit= parseInt(limitPerPage,10);

 var page = req.query.page > 0 ? req.query.page : 0;

 console.log('Search page parameters');
 console.log('username='+usrName);
 console.log('userid='+userid);
 console.log('page='+page);
 console.log('limitPerPage='+limit);

 var query;
 if (usrName == 'all' && userid == '0') {
  query = userModel.find({});
 }
 else if (usrName == 'all' && userid != '0'){
  query = userModel.find({ 'userid' : userid });
 }
  else if (usrName != 'all' && userid == '0'){
  query = userModel.find({ 'username' : usrName });
 }

 // limit our results to limitPerPage items
 query.limit(limit);
 // skip on to the next page records
 query.skip(limitPerPage * page);

 // execute the query
 query.exec(function (err, users) {
  if (err) {
     handleError(res, err.message, "Failed to get users.");
    }else{
     res.status(200).json(users);
    }
  });
});

//-------------------------------------------------------------------------------
//PLACEHOLDER FUNCTION TO FIND CURRENT USER
// http://localhost:3000/api/v1/user?userid=11
//-------------------------------------------------------------------------------
app.get('/api/v1/kivuser', function(req, res) {

 var userid= req.query.userid;
 var query;
 query = userModel.find({ 'userid' : userid });

 // execute the query
 query.exec(function (err, user) {
  if (err) {
     handleError(res, err.message, "Failed to get users.");
    }else{
     res.status(200).json(user);
    }
  }); 
});
	

//-------------------------------------------------------------------------------
//PLACEHOLDER FUNCTION TO CREATE A NEW USER
//-------------------------------------------------------------------------------
app.post('/api/v1/kivuser', function(req, res) {

 var newUserid='3'; // todo: increment the count
 var newUsername= req.body.username;
 var newPassword= req.body.password;
 var newAdmin= req.body.admin;
 var newProfilePic= ''; // todo: convert pic to base64
 var newDepartment= req.body.department;
/*
 var newUserid='15';
 var newUsername= 'Mark';
 var newPassword= 'password1';
 var newAdmin= 'false';
 var newProfilePic= ''; 
 var newDepartment= 'Dept A';
 */
 console.log('Create page parameters');

 console.log('username='+newUsername);
 console.log('userid='+newUserid);
 console.log('password='+newPassword);
 console.log('admin='+newAdmin);
 console.log('profilePic='+newProfilePic);
 console.log('department='+newDepartment);

 // Create an instance of model user
 var newUsr = new userModel({ userid: newUserid, 
	username: newUsername,
	password: newPassword,
	admin: newAdmin,
	profilePic: newProfilePic,
	department: newDepartment  });

 // Save the new model instance, passing a callback
 newUsr.save(function (err) {
  if (err) {
     handleError(res, err.message, "Failed to get users.");
  }else{
     res.status(200).json({'userid':newUserid});
  }
  // saved!
});
});

//-------------------------------------------------------------------------------
//PLACEHOLDER FUNCTION TO DELETE A USER
// http://localhost:3000/api/v1/user/12
//-------------------------------------------------------------------------------
app.delete('/api/v1/kivuser/:id', function(req, res) {

 var delUserid= req.params.id;
 console.log('Delete page parameters');
 console.log('delete userid='+delUserid);

/**
 userModel.find({ userid: delUserid }, function(err, user) {
  if (err) throw err;

  // delete him
  userModel.remove(function(err) {
    if (err) throw err;

    console.log('User successfully deleted!');
  });
});
*/

 userModel.findOneAndRemove({ userid: delUserid }, function(err) {
  if (err)  {
     handleError(res, err.message, "Failed to get users.");
  }else{
     res.status(200).json(req.params.id);
  }

  // we have deleted the user
  console.log('User deleted!');
 });

});

//-------------------------------------------------------------------------------
//PLACEHOLDER FUNCTION TO UPDATE A USER
// http://localhost:3000/api/v1/user/11
//-------------------------------------------------------------------------------
app.put('/api/v1/kivuser/:id', function(req, res) {

 var updUserid= req.params.id;
 var newUsername= req.body.username;
 var newPassword= req.body.password;
 //var newAdmin= req.body.admin;
 var newProfilePic= ''; // todo: convert pic to base64
 var newDepartment= req.body.department;

 console.log('Update page parameters');
 console.log('userid='+updUserid);
 console.log('username='+newUsername);
 console.log('password='+newPassword);
 //console.log('admin='+newAdmin);
 console.log('profilePic='+newProfilePic);
 console.log('department='+newDepartment);


 var query   = { userid: updUserid  }; 
 var update  = { username: newUsername, password: newPassword, profilePic: newProfilePic, department: newDepartment}; 
 var options = { new: true }; 
 userModel.findOneAndUpdate(query, update, options, function(err, user){ 
  if (err) {
     console.log('Error update user');
     handleError(res, err.message, "Failed to get users.");
  }else{
	
     		res.status(200).json(user);
  }
 });
}); 

