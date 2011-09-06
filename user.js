var Stream = require('./stream');
function User(userId) {
    this.userId = userId;
//    this._load();
}


User.prototype.createStream = function(streamName, callback, args) {
    var newStream = new Stream(false, streamName, this.userId, function(streamObj) {
        console.log('created stream');
        callback(streamObj, args);
    });
};

module.exports = User;
