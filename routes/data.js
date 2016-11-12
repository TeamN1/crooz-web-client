var express = require('express');
var router = express.Router();

/* POST data. */
router.post('/', function (req, res, next) {
  var data = req.body;

  // Extract data
  var lat, long, mood, song;

  if (data.location) {
    lat = data.location.lat;
    long = data.location.long;
    mood = data.mood;
    song = data.song;
  }
  else {
    res.sendStatus(500);
    return;
  }
  
  res.sendStatus(200);
});

module.exports = router;
