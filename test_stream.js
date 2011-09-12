var User = require('./user');

//login
var user = new User(true, "JL", "pass", function(result){
	if (result){
		console.log("login user successfully");
	}else{
		console.log("login user failed")
	}
});

//create stream
user.createStream("wutup", function(result){
	console.log(user.streams);
	
	user.loadOwnStreams(function(userObj){
		console.log("Own streams");
		console.log(userObj.ownStreams);
	});
});




