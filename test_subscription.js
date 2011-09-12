var User = require('./user');


//create user
var newuser = new User(false, "JL22", "pass", function(result){
	if (result){
		console.log("created user successfully");
	}else{
		console.log("created user failed, duplicate")
	}
});

//login
var user = new User(true, "JL22", "pass", function(result){
	if (result){
		console.log("login user successfully");
		
		user.subscribeStream('11e42f5b-643a-425e-bb1b-c216e396e2aa', function(result){
			console.log("current subscriptions");
			user.loadSubStreams(function(result){
				console.log(user.subStreams);
			});
		});
	}else{
		console.log("login user failed")
	}
});