var express = require('express');
var azure = require('azure-storage');
var router = express.Router();

var tableService = azure.createTableService("croozdata", "NjwMoGKltY9rgfVhks/BdNpqtbslMo8HEnZeQVMmZEWd6/pEdG4UWG2yqw37NPQnWjyIb7AtD8ALrEK5Amx5vQ==");

tableService.createTableIfNotExists('data', function(error, result, response) {
  if (!error) {
    // result contains true if created; false if already exists
    console.error("Data table already exists");
  }
});

/* POST data. */
router.post('/', function (req, res, next) {
  var data = req.body;

  if (!data.geo) {
    res.sendStatus(500);
    return;
  }

  // Write to storage
  var entGen = azure.TableUtilities.entityGenerator;
  var task = {
    PartitionKey: entGen.String(data.userId), // User ID
    RowKey: (new Date()).toISOString(), // RowKey from datetime
    tripId: entGen.String(data.tripId), // Session ID
    latitude: entGen.Double(data.geo.lat), // Latitude
    longitude: entGen.Double(data.geo.lon), // Longitude
    speed: entGen.Double(data.speed),
    mood: entGen.String(JSON.stringify(data.mood)), // Current mood
    song: entGen.String(data.song), // Current song
    time: entGen.DateTime(data.time) // Timestamp from client
  };

  tableService.insertEntity('data', task, function(error, result, response) {
    if (!error) {
      // result contains the ETag for the new entity
    }
  });

  data.time = new Date();

  // Emit to all listeners in the room 
  room = data.userId+data.tripId;
  req.app.io.to(room).emit('newPacket', data);

  // console.log(data);
  
  res.sendStatus(200);
});

module.exports = router;
