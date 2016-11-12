module.exports = function(server) {
    var io = require('socket.io')(server);

    /**
     * Notify when user connected
     */

    io.on('connection', function(socket){
        console.log('a user connected');
    });
    
    return io;
}