var sys    = require('sys'),
    sqlite = require('sqlite'),
    _ = require('underscore'),
	uuid = require('node-uuid');
var Post = require('./post');


function Stream(load) {
	if (load) {
        this.streamId = arguments[1];
        var callback   = arguments[2];
        var args       = arguments[3];
        // load from db
        this._load(this.streamId,callback, args);
    } else {
        this.streamName = arguments[1];
        this.userId     = arguments[2];
        var callback   = arguments[3];
        var args       = arguments[4];

        //this.posts = [];
		this.steramId = uuid(); //create a UUID
        this._create(this.streamId, this.streamName, this.userId, callback, args)
    }
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
                callback(self, args);
            });
        });
    },


    _load: function(streamId, callback, args) {
        var query = "SELECT stream_id, stream_name, user_id, timestamp FROM stream WHERE " + 
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
						self.streamId = res.stream_id;
	                    self.streamName = res.stream_name;
	                    self.userId = res.user_id;
						callback(self, args);
					}
                }
            });
        });
    },

	_findByUserId: function(userId, callback, args) {
        var query = "SELECT stream_id, stream_name, user_id, timestamp FROM stream WHERE " + 
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
							r.timestamp = res.timestamp;
							result.push(r);
						}
						callback(self, args);
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


//add a post to a stream
Stream.prototype.addPost = function(streamId, userId, data, callback, args) {
    //create the post object
	var post = new Post();
	var id = uuid(); //create a UUID
	post._create(id, streamId, userId, data, function(result){
		callback(result); //return new postId
	});
};

//get posts in a steram
Stream.prototype.getPostsByStreamId = function(streamId, callback, args){
	var post = new Post();
	post._findByStreamId(streamId, function(result){
		callback(result);
	});
};

module.exports = Stream;
