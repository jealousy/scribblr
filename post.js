var sys    = require('sys'),
    sqlite = require('sqlite'),
	uuid = require('node-uuid'),
    _ = require('underscore');

function Post(load) {
 	if (load) {
        this.postId = arguments[1];
        var callback = arguments[2];
        var args = arguments[3];
        // load from db
        this._load(this.postId, callback, args);
    } else {
        this.streamId = arguments[1];
		this.userId = arguments[2];
        this.data = arguments[3];
        var callback = arguments[4];
        var args = arguments[5];

        //post id is concatenation of streamName and timestamp
        this.postId = uuid(); //create a UUID
        this._create(this.postId, this.streamId, this.userId, this.data, callback, args)
    }
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
                callback(self, args)
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
						self.streamId = res.stream_id;
	                    self.postId = res.post_id;
	                    self.userId = res.user_id;
						self.data = res.data;
						callback(self, args);
					}
                }
            });
        });
    },
};

module.exports = Post;
