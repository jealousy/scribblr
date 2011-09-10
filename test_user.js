var User = require('./user');

//create user
var user = new User(false, "JL", "pass", function(result){
	if (result){
		console.log("created user successfully");
	}else{
		console.log("created user failed, duplicate")
	}
});

var user = new User(true, "JL", "pass", function(result){
	if (result){
		console.log("login user successfully");
	}else{
		console.log("login user failed")
	}
});

var user = new User(true, "JL", "failpass", function(result){
	if (result){
		console.log("login user successfully");
	}else{
		console.log("login user failed")
	}
});