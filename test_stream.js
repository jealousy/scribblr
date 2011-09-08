var User = require('./user');

var user = new User();

var userId = "user1";
var password = "password";

//login
user.login(userId,password, function(result){
	if (result){
		console.log("login successful");
		
		//add a stream
		user.addStream("nalinStream",userId, function(result){
			if (result){
				console.log("new streamId is: " + result);
			}
		});
	}else{
		console.log("login failed");
	}
});

//find all streams by a user
user.getStreamsByUserId(userId, function(result){
	console.log("getStreamsByUserId");
	console.log(result);
});




