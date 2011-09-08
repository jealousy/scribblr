var Stream = require('./stream');
var Post = require('./post');
var Subs = require('./subscription');
var sys    = require('sys'),
    sqlite = require('sqlite'),
    _ = require('underscore'),
	uuid = require('node-uuid');

function User() {

}

User.prototype._create = function(userId, password, callback, args) {
	var query = "INSERT INTO user (user_id, password) VALUES (?,?)";
    var db = new sqlite.Database();
    var self = this; // used for context
    db.open("scribblr.db", function(error) {
        if (error) {
            console.log('Error connecting to db');
            throw error;
        }

		//check if the user_id exists already
		self._exist(userId, function(result){
			if (!result){
				//not exist, create new user
		        db.execute(query, [userId, password], function(error) {
		            if (error) throw error;
					callback(true);
		        });
			}else{
				callback(false);
			}
		});
    });
};

User.prototype._exist = function(userId, callback, args) {
    var query = "SELECT user_id FROM user WHERE " + 
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
				if (rows.length == 0){
					callback(false);
				}else{
					callback(true);
				}
            }
        });
    });
};

User.prototype._login = function(userId, password, callback, args) {
    var query = "SELECT user_id, password FROM user WHERE " + 
        "user_id = ? AND password = ?";

    var db = new sqlite.Database();
    var self = this; // used for context
    db.open("scribblr.db", function(error) {
        if (error) {
            console.log('Error connecting to db');
            throw error;
        }

        db.execute(query, [userId, password], function(error, rows) {
            if (error) {
                throw error;
            } else {
				if (rows.length == 0){
					callback(false);
				}else{
					callback(true);
				}
            }
        });
    });
};

User.prototype.login = function(userId, password, callback, args){
	this._login(userId, password, function(result){
		callback(result);
	});
};

User.prototype.createNewUser = function(userId, password, callback, args){
	this._create(userId, password, function(result){
		callback(result);
	});
};

//a user creates a stream
User.prototype.addStream = function(streamName,userId, callback, args){
	var stream = new Stream();
	var id = uuid(); //create a UUID
	var self = this;
	stream._create(id, streamName, userId, function(result){
		//subscribe to own stream
		self.subscribeStream(result, userId,function(result){ 
			callback(id); //return new streamId,
		});
	});
};

//get all streams created by a user
User.prototype.getStreamsByUserId = function(userId, callback, args){
	var stream = new Stream();
	stream._findByUserId(userId, function(result){
		callback(result);
	});
};

//get all posts created by a user
User.prototype.getPostsByUserId = function(userId, callback, args){
	var post = new Post();
	post._findByUserId(userId, function(result){
		callback(result);
	});
};

//subscribe to a stream
User.prototype.subscribeStream = function(streamId, userId, callback, args){
	var subs = new Subs();
	subs._create(streamId, userId, function(result){
		callback(result); //return new subscriptionId
	});
};

//get all streams id subscribe by user
User.prototype.getSubscriptions = function(userId, callback, args){
	var subs = new Subs();
	subs._findSubsByUserId(userId,function(result){
		callback(result);
	});
};

module.exports = User;
