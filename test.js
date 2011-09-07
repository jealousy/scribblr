var User = require('./user'),
    Post = require('./post'),
    Stream = require('./stream');


var u = new User('12345'); //user id - have not created user table yet

u.createStream('Cat-stream', function(streamObj) {

    streamObj.addPost('meow', function(o) {
        console.log(o); //we can see what the stream object looks like now;
    });

})
