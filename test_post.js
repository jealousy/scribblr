var User = require('./user');

//login
var user = new User(true, "JL", "pass", function(result){
	if (result){
		console.log("login user successfully");
		//create stream
		user.createStream("post test", function(streamObj){
			console.log(user.streams);
			
			streamObj.addPost("post1",function(postObj){
				console.log(postObj);
				
				streamObj.addPost("post2",function(postObj){
					console.log(postObj);
					
					streamObj.addPost("post3",function(postObj){
						console.log(postObj);
						
						//load all posts
						console.log("load all posts");
						streamObj.loadPosts(function(streamObj){
							console.log(streamObj.posts);
						});
					});
				});
			});
		});
	}else{
		console.log("login user failed")
	}
});


