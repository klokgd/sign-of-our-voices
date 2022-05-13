var express = require('express');
var path = require('path');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('successfully', { title: 'Hui', body: "Upload successfully" });
});

module.exports = router;
