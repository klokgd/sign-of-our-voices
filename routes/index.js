var express = require('express');
var path = require('path');
var router = express.Router();
const Collections = require('../models/collection');
const Picture = require("../models/picture");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const collections = await Collections.find({})
  res.render('index', { title: 'Hui', collections });
});

module.exports = router;
