var express = require('express');
var azure = require('azure-storage');
var router = express.Router();

var tableService = azure.createTableService("croozdata", "NjwMoGKltY9rgfVhks/BdNpqtbslMo8HEnZeQVMmZEWd6/pEdG4UWG2yqw37NPQnWjyIb7AtD8ALrEK5Amx5vQ==");

tableService.createTableIfNotExists('users', function(error, result, response) {
  if (!error) {
    // result contains true if created; false if already exists
    console.error("User table already exists");
  }
});

/* GET 5 latest users. */
router.get('/', function (req, res, next) {
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

            console.log(users);
            res.json(users);
        }
        else {
            res.sendStatus(500);
        }
    });

});

/* POST data. */
router.post('/', function (req, res, next) {
  var user = req.body;

  // Extract data
  var id, name, currentSession;

  if (user.id) {
    id = user.id;
    name = user.name;
    currentSession = user.currentSession;
  }
  else {
    res.sendStatus(500);
    return;
  }

  var entGen = azure.TableUtilities.entityGenerator;
  var task = {
    PartitionKey: entGen.String('user'), // User ID
    RowKey: entGen.String(id), // User ID 
    name: entGen.String(name), // Latitude
    currentSession: entGen.String(currentSession) // Longitude
  };

  tableService.insertOrReplaceEntity('users', task, function(error, result, response) {
    if (!error) {
      // result contains the ETag for the new entity
    }
  });
  
  res.sendStatus(200);
});

module.exports = router;
