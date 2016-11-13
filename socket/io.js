var azure = require('azure-storage');

var tableService = azure.createTableService("croozdata", "NjwMoGKltY9rgfVhks/BdNpqtbslMo8HEnZeQVMmZEWd6/pEdG4UWG2yqw37NPQnWjyIb7AtD8ALrEK5Amx5vQ==");

tableService.createTableIfNotExists('users', function(error, result, response) {
  if (!error) {
    // result contains true if created; false if already exists
    console.error("IO: user table already exists");
  }
});

tableService.createTableIfNotExists('data', function(error, result, response) {
  if (!error) {
    // result contains true if created; false if already exists
    console.error("Data table already exists");
  }
});

// Send the client a list of users
function sendUsers(io, socketId) {
    var users = [];

    var query = new azure.TableQuery()
        .top(10)
        .where('PartitionKey eq ?', 'user');

    tableService.queryEntities('users',query, null, function(error, result, response) {
        if(!error) {
            
            // query was successful
            for (var i = 0; i < result.entries.length; i++) {
                console.log(result.entries[i]);
                users[i] = {
                    id: result.entries[i].RowKey._,
                    name: result.entries[i].name._,
                    currentSession: result.entries[i].currentSession._,
                    lastActive: result.entries[i].Timestamp._
                }
                
            }

            io.to(socketId).emit('connected', users);
        }
    });
    
}

// Send the client all the packets it missed 
function dumpPackets(io, socketId, userId, tripId) {

}

module.exports = function(server) {
    var io = require('socket.io')(server);

    /**
     * Notify when user connected
     */

    io.on('connection', function(socket){
        console.log('a user connected');
        console.log(socket.id);

        // Send list of all users
        sendUsers(io,socket.id);

        // Subscribe to room
        socket.on('subscribe', function(user){
            var room = user.id+user.currentSession;
            socket.join(room);
            console.log('Subscribed to: ' + room);
            // dumpPackets(io,socket.id,)
        });

        // Unsubscribe from room
        socket.on('unsubscribe', function(room){
            socket.leave(room);
            console.log('Unsubscribed from: ' + room);
        });
    });
    
    return io;
}