var sqlite = require('sqlite');

function Post(load) {
    if (load) {
        this.postId = arguments[1];
        var callback = arguments[2];
        var args = arguments[3];
        // load from db
        this._load(this.postId, callback, args);
    } else {
        var streamName = arguments[1];
        this.streamId = arguments[2];
        this.data = arguments[3];
        var callback = arguments[4];
        var args = arguments[5];

        //post id is concatenation of streamName and timestamp
        this.postId = streamName + (new Date()).getTime();
        this._create(callback, args)
    }
}


Post.prototype = {
    _create: function(callback, args) {

        var query = "INSERT INTO post (post_id, stream_id, data) VALUES (?,?,?)";
        var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }
            db.execute(query, [self.postId, self.streamId, self.data], function(error) {
                if (error) throw error;
                callback(self, args)
            });
        });
    },

    _load: function(postId, callback, args) {

        var query = "SELECT data FROM post WHERE " + 
            "post_id = ?";

        var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }

            db.execute(query, [self.postId], function(error, rows) {
                if (error) {
                    throw error;
                } else {
                    //should only return one row
                    res = rows[0];
                    self.data = res.data;
                    callback(self, args);
                }
            });
        });

    },

    getPostId: function() {
        return this.postId;
    },
};

module.exports = Post;
