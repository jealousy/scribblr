var User = require('./user');
var Stream = require('./stream');

var user = new User();
var stream = new Stream();	

var userId = "user1";
var password = "password";
var streamId;

//login
user.login(userId,password, function(result){
	if (result){
		console.log("login successful");
		
		//add a stream
		user.addStream("nalinStream",userId, function(result){
			if (result){
				console.log("new streamId is: " + result);
				streamId = result;
				
				//get subscription of a user
				user.getSubscriptions(userId,function(result){
					console.log("user subscribed to streams: ");
					console.log(result);
				});
				
				//subscribe to same stream twice, should return error
				user.subscribeStream(streamId, userId, function(result){
					if (!result){
						console.log("fail to subscribe to stream, prob duplicate");
					}
				});
			}
		});
	}else{
		console.log("login failed");
	}
});