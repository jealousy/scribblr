var sys    = require('sys'),
    sqlite = require('sqlite'),
    _ = require('underscore');

function Post() {
}


Post.prototype = {
    _create: function(postId, streamId, userId, data, callback, args) {

        var query = "INSERT INTO post (post_id, stream_id, data, user_id, timestamp) VALUES (?,?,?,?,?)";
        var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }
            db.execute(query, [postId, streamId, data, userId, (new Date()).getTime()], function(error) {
                if (error) throw error;
                callback(postId, args)
            });
        });
    },

    _load: function(postId, callback, args) {

        var query = "SELECT post_id, stream_id, data, user_id, timestamp FROM post WHERE " + 
            "post_id = ?";

        var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }

            db.execute(query, [postId], function(error, rows) {
                if (error) {
                    throw error;
                } else {
                    //should only return one row
					if (rows.length == 0)
					{
						callback(null);
					}else{
	                    res = rows[0];
						result = new Object();
						result.streamId = res.stream_id;
	                    result.postId = res.post_id;
	                    result.userId = res.user_id;
						result.data = res.data;
						result.timestamp = res.timestamp;
						callback(result, args);
					}
                }
            });
        });
    },

	//find all posts in a stream
	_findByStreamId: function(streamId, callback, args){
		var query = "SELECT post_id, stream_id, data, user_id, timestamp FROM post WHERE " + 
	            "stream_id = ?";
		
		var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }

            db.execute(query, [streamId], function(error, rows) {
                if (error) {
                    throw error;
                } else {
                    //should only return one row
					if (rows.length == 0)
					{
						callback(null);
					}else{
						result = new Array();
						for (i = 0; i < rows.length; i++){
							res = rows[i];
							r = new Object();
							r.postId = res.post_id;
							r.streamId = res.stream_id;
		                    r.data = res.data;
		                    r.userId = res.user_id;
							r.timestamp = res.timestamp;
							result.push(r);
						}
						callback(result, args);
					}
                }
            });
        });
	},
	
	//find all posts created by a user
	_findByUserId: function(userId, callback, args){
		var query = "SELECT post_id, stream_id, data, user_id, timestamp FROM post WHERE " + 
	            "user_id = ?";
		
		var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }

            db.execute(query, [userId], function(error, rows) {
                if (error) {
                    throw error;
                } else {
                    //should only return one row
					if (rows.length == 0)
					{
						callback(null);
					}else{
						result = new Array();
						for (i = 0; i < rows.length; i++){
							res = rows[i];
							r = new Object();
							r.postId = res.post_id;
							r.streamId = res.stream_id;
		                    r.data = res.data;
		                    r.userId = res.user_id;
							r.timestamp = res.timestamp;
							result.push(r);
						}
						callback(result, args);
					}
                }
            });
        });
	},
};

module.exports = Post;
