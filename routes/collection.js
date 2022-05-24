var express = require('express');
var path = require('path');
var router = express.Router();
const Collections = require('../models/collection');
const Pictures = require('../models/picture');

/* GET home page. */
router.get('/', async function (req, res, next) {
    const collections = await Collections.find({})
    res.render('index', {title: 'Hui', collections});
});

router.get('/:id', async function (req, res, next) {
    let collectionId = req.params["id"];
    const collection = await Collections.findById(collectionId);
    let listOfIdPictures = collection._doc.pictures;
    let pictures = await Pictures.find({
        '_id': { $in: listOfIdPictures}});

    res.render('collection', { title: 'Hui', body: "Upload successfully", pictures, collectionId});

});

module.exports = router;
