var express = require('express');
var path = require('path');
var router = express.Router();
const Picture = require('../models/picture');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const pictures = await Picture.find({})
    res.render('successfully', { title: 'Hui', body: "Upload successfully", pictures});
});

module.exports = router;
