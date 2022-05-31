var express = require('express');
var path = require('path');
var router = express.Router();
const Collections = require('../models/assemblage');
const Picture = require("../models/picture");
const pasport

/* GET home page. */
router.get('/', async function(req, res, next) {
  const collections = await Collections.find({})
  res.render('index', { title: 'sIGN', collections });
});

router.get("/registration/${network}", (req,res)=>{
  pass
})

module.exports = router;
