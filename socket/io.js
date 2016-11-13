module.exports = function(server) {
    var io = require('socket.io')(server);

    /**
     * Notify when user connected
     */

    io.on('connection', function(socket){
        console.log('a user connected');
        console.log(socket.id);
        // io.to(socket.id).emit('testEmit', "lol");

        // Subscribe to room
        socket.on('subscribe', function(room){
            socket.join(room);
            console.log('Subscribed to: ' + room);
        });

        // Unsubscribe from room
        socket.on('unsubscribe', function(room){
            socket.leave(room);
            console.log('Unsubscribed from: ' + room);
        });
    });
    
    return io;
}