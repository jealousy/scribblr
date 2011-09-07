var User = require('./user');
var user = new User();

user.createNewUser("user1","password", function(result){
	if (result){
		console.log("create new user successful");
	}else{
		console.log("create new user failed, prob duplicate user_id");
	}
});

user.login("user1","password", function(result){
	if (result){
		console.log("login successful");
	}else{
		console.log("login failed");
	}
});