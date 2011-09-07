var sys    = require('sys'),
    sqlite = require('sqlite'),
    _ = require('underscore'),
	uuid = require('node-uuid');


function Stream() {
}

Stream.prototype = {
    _create: function(streamId, streamName, userId, callback, args) {

        var query = "INSERT INTO stream (stream_id, stream_name, user_id, timestamp) VALUES (?,?,?,?)";
        var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }
            db.execute(query, [streamId, streamName, userId, (new Date()).getTime()], function(error, rows) {
                if (error) throw error;
                callback(streamId, args);
            });
        });
    },

    _findByStreamId: function(streamId, callback, args) {
        var query = "SELECT stream_id, stream_name, user_id, posts, timestamp FROM stream WHERE " + 
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
	                    res = rows[0];
						result = new Object();
						result.streamId = res.stream_id;
	                    result.streamName = res.stream_name;
	                    result.userId = res.user_id;
	                    result.posts = JSON.parse(res.posts);
						result.timestamp = res.timestamp;
						callback(result, args);
					}
                }
            });
        });
    },

	_findByUserId: function(userId, callback, args) {
        var query = "SELECT stream_id, stream_name, user_id, posts, timestamp FROM stream WHERE " + 
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
							r.streamId = res.stream_id;
		                    r.streamName = res.stream_name;
		                    r.userId = res.user_id;
		                    r.posts = JSON.parse(res.posts);
							r.timestamp = res.timestamp;
							result.push(r);
						}
						callback(result, args);
					}
                }
            });
        });
    },

	/* Not fixed yet, not working 
    _update: function(callback, args) {
        //this function should write to cache and db

        var query = "UPDATE stream SET posts = ? WHERE stream_id = ?";

        var db = new sqlite.Database();

        var self = this; // used for context

        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }

            db.execute(query, [JSON.stringify(self.posts), self.streamId], function(error, rows) {
                if (error) throw error;

                console.log('updated');
                callback(args);
            });
        });

    },*/
}

Stream.prototype.addStream = function(streamName,userId, callback, args){
	var id = uuid(); //create a UUID
	this._create(id, streamName, userId, function(result){
		callback(result);
	});
};

Stream.prototype.findByStreamId = function(streamId, callback, args){
	this._findByStreamId(streamId, function(result){
		callback(result);
	});
};

Stream.prototype.findByUserId = function(userId, callback, args){
	this._findByUserId(userId, function(result){
		callback(result);
	});
};

/* not fixed yet, not working
Stream.prototype.addPost = function(data, callback, args) {
    //create the post object
    var Post = require('./post');
    var self = this;
    var newPost = new Post(false, this.streamName, this.streamId, data, function(postObj) {

        self.posts.push(postObj.getPostId());
        console.log(self.streamId);
        self._update(function() {
            callback(self, args);
        });
    });
};*/


module.exports = Stream;
