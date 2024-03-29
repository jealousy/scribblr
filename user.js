var Stream = require('./stream');
var sys    = require('sys'),
    sqlite = require('sqlite'),
    _ = require('underscore'),
	uuid = require('node-uuid');

function User(load) {
	if (load) {
        this.userId = arguments[1];
		this.password = arguments[2];
		this.ownStreams = [];
		this.subStreams = [];
		this.subscriptions = [];
        var callback   = arguments[3];
        var args       = arguments[4];
        // load from db
        this._login(this.userId, this.password, callback, args);
    } else {
        this.userId = arguments[1];
        this.password     = arguments[2];
		this.ownStreams = [];
		this.subStreams = [];
		this.subscriptions = [];
        var callback   = arguments[3];
        var args       = arguments[4];
        this._create(this.userId, this.password, callback, args);
    }
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
					callback(self, args);
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
    var query = "SELECT user_id, password, subscriptions FROM user WHERE " + 
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
					self.subscriptions = JSON.parse(rows[0].subscriptions);
					if (self.subscriptions == null)
					{
						self.subscriptions = [];
					}
					callback(true);
				}
            }
        });
    });
};

	
User.prototype._findOwnStreamsId = function(userId, callback, args) {
    var query = "SELECT stream_id FROM stream WHERE " + 
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
						result.push(res.stream_id);
					}
					callback(result, args);
				}
            }
        });
    });
};

User.prototype._updateSubscription = function(callback, args){
	var query = "UPDATE user SET subscriptions = ? WHERE user_id = ?";

    var db = new sqlite.Database();

    var self = this; // used for context

    db.open("scribblr.db", function(error) {
        if (error) {
            console.log('Error connecting to db');
            throw error;
        }

        db.execute(query, [JSON.stringify(self.subscriptions), self.userId], function(error, rows) {
            if (error) throw error;
            callback(self, args);
        });
    });
}

//a user creates a stream
User.prototype.createStream = function(streamName,callback, args){
	self = this;
	var stream = new Stream(false, streamName, this.userId, function(streamObj){
		self.ownStreams.push(streamObj);
		callback(streamObj, args);
	});
};

//get all streams created by a user
User.prototype.loadOwnStreams = function(callback, args){
	this.ownStreams = [];
	self = this;
	this._findOwnStreamsId(this.userId, function(result){
		for (i=0; i<result.length; i++){
			if (i == (result.length -1)){
				var last = true;
			}
			var stream = new Stream(true, result[i], function(streamObj, last){
				self.ownStreams.push(streamObj);	
				if (last == true){;
					callback(self,args);
				}
			}, last);
		}
	});
};

//get all streams subscribed by user
User.prototype.loadSubStreams = function(callback, args){
	this.subStreams = [];
	self = this;
	for (i=0; i<this.subscriptions.length; i++){
		if (i == (this.subscriptions.length -1)){
			var last = true;
		}
		var stream = new Stream(true,this.subscriptions[i], function(streamObj, last){
			self.subStreams.push(streamObj);	
			if (last == true){;
				callback(self,args);
			}
		}, last);
	}
};


//subscribe to a stream
User.prototype.subscribeStream = function(streamId, callback, args){
	this.subscriptions.push(streamId);
	this._updateSubscription(function(result){
		callback(result);
	});
};



module.exports = User;
