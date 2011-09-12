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
		this.posts = [];
        this._load(this.streamId,callback, args);
    } else {
        this.streamName = arguments[1];
        this.userId     = arguments[2];
        var callback   = arguments[3];
        var args       = arguments[4];

        this.posts = [];
		this.streamId = uuid(); //create a UUID
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

	_findPostsId: function(streamId, callback, args){
		var query = "SELECT post_id FROM post WHERE " + 
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
							result.push(rows[i].post_id);
						}
						callback(result, args);
					}
                }
            });
        });
	},
}


//add a post to a stream
Stream.prototype.addPost = function(data, callback, args) {
	self = this;
    //create the post object
	var post = new Post(false,this.streamId, this.userId, data, function(postObj){
		self.posts.push(postObj);
		callback(postObj,args);
	});
};

//get posts in a steram
Stream.prototype.loadPosts = function(callback, args){
	this.posts = [];
	self = this;
	this._findPostsId(this.streamId, function(result){
		for (i=0; i<result.length; i++){
			if (i == (result.length -1)){
				var last = true;
			}
			var post = new Post(true, result[i], function(postObj, last){
				self.posts.push(postObj);	
				if (last == true){;
					callback(self,args);
				}
			}, last);
		}
	});
};

module.exports = Stream;
