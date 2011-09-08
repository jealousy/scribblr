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
				
				//create a post to stream
				stream.addPost(streamId, userId, "a testing post", function(result){
					console.log('new postId is: '+ result);
					
					//get all posts from a stream
					stream.getPostsByStreamId(streamId, function(result){
						console.log("posts from a stream");
						console.log(result);
					});
					
					//get all posts from a user
					user.getPostsByUserId(userId, function(result){
						console.log("posts from a user");
						console.log(result);
					});
				}); 
			}
		});
	}else{
		console.log("login failed");
	}
});