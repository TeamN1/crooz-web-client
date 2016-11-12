var express = require('express');
var router = express.Router();

/* POST data. */
router.post('/', function (req, res, next) {
  var data = req.body;
  
  res.send(req.body);
});

module.exports = router;
