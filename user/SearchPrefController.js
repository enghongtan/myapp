var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('../auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var UserPref = require('../models/userPref');

//-------------------------------------------------------------------------------
// UPDATES USER SEARCH PREFERENCE IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
//-------------------------------------------------------------------------------
router.put('/userpref/:id',  VerifyToken, function (req, res) {

 var updUserid= req.params.id;
 var updSearchPref= req.body.searchPref;

 console.log("searchPreference: "+updSearchPref);
 console.log("my userid:" + req.userId);
 console.log("updateUserid:" + updUserid);

 if(updSearchPref!=null){
 
	if(req.userId == updUserid ) {

		var query   = { userid: updUserid  };
		UserPref.findOne(query, function(err,user){
			if (err){
				console.log(err);
				return res.status(500).send("There was a problem updating the user.");
			}
			else if(!user){
				console.log("Search preference not present, creating new");
				
				res.status(200).send("Search preference created");
			}
			else{
				console.log("Updating search preference");
				user.searchPref=updSearchPref;			
				user.markModified("searchPref");
				user.save();	
				res.status(200).send(user);
			}
		});

	}
	else{
		return res.status(401).send("Unauthorized. Cannot update others");
	}

 }
 else{
	return res.status(401).send("Search preference is empty");
 }

});
module.exports = router;
