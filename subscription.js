var sys    = require('sys'),
    sqlite = require('sqlite'),
    _ = require('underscore');

function Subscription() {
}


Subscription.prototype = {
    _create: function(streamId, userId, callback, args) {
        var query = "INSERT INTO subscription (subscription_id, stream_id, user_id) VALUES (?,?,?)";
        var db = new sqlite.Database();

        var self = this; // used for context
        db.open("scribblr.db", function(error) {
            if (error) {
                console.log('Error connecting to db');
                throw error;
            }

			//check if the subscription exists already
			self._exist(streamId, userId, function(result){
				if (!result){
					//not exist, create new subscription
					var subscriptionId = streamId + userId; //concatenate both Id
		            db.execute(query, [subscriptionId, streamId, userId], function(error) {
		                if (error) throw error;
		                callback(subscriptionId, args)
		            });
				}else{
					callback(false);
				}
			});
        });
    },

	//whether the subscription already exist
	_exist: function(streamId, userId, callback, args) {
	    var query = "SELECT subscription_id FROM subscription WHERE " + 
	        "user_id = ? AND stream_id =?";

	    var db = new sqlite.Database();
	    var self = this; // used for context
	    db.open("scribblr.db", function(error) {
	        if (error) {
	            console.log('Error connecting to db');
	            throw error;
	        }

	        db.execute(query, [userId, streamId], function(error, rows) {
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
	},


	//get all streams subscribed by a user
	_findSubsByUserId: function(userId, callback, args){
		var query = "SELECT subscription_id, stream_id, user_id FROM subscription WHERE " + 
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
							r.subscriptionId = res.subscription_id;
							r.streamId = res.stream_id;
		                    r.userId = res.user_id;
							result.push(r);
						}
						callback(result, args);
					}
                }
            });
        });
	},
};

module.exports = Subscription;
