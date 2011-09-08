var User = require('./user');
var Stream = require('./stream');

var user = new User();
var stream = new Stream();

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
				
				//find stream by streamId
				stream.findByStreamId(result, function(result){
					console.log("findByStreamId");
					console.log(result);
				});
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




