var express = require('express');
var router = express.Router();
var db = require('./queries');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/shipping', db.getAllShippingData);

module.exports = router;