var sys    = require('sys'),
    sqlite = require('sqlite'),
    _ = require('underscore');


function Stream(load) {
    if (load) {
        this.streamId = arguments[1];
        var callback   = arguments[2];
        var args       = arguments[3];
        // load from db
        this._load(this.streamId, callback, args);
    } else {
        this.streamName = arguments[1];
        this.userId     = arguments[2];
        var callback   = arguments[3];
        var args       = arguments[4];

        this.posts = [];

        //stream id is concatenation of streamName, userId and timestamp
        this.streamId = this.streamName + this.userId + (new Date()).getTime();

        this._create(callback, args)
    }
}

Stream.prototype = {

    _create: function(callback, args) {

        var query = "INSERT INTO stream (stream_id, stream_name, user_id) VALUES (?,?,?)";
        var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }
            db.execute(query, [self.streamId, self.streamName, self.userId], function(error) {
                if (error) throw error;
                callback(self, args)
            });
        });
    },

    _load: function(callback, args) {
        var query = "SELECT stream_name, user_id, posts FROM stream WHERE " + 
            "stream_id = ?";

        var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }

            db.execute(query, [self.streamId], function(error, rows) {
                if (error) {
                    throw error;
                } else {
                    //should only return one row
                    res = rows[0];
                    self.streamName = res.stream_name;
                    self.userId = res.user_id;
                    self.posts = JSON.parse(res.posts);

                    callback(self, args);
                }
            });
        });
    },


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

    },

    addPost: function(data, callback, args) {
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
    },
}

module.exports = Stream;
