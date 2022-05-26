var express = require('express');
var path = require('path');
var router = express.Router();
const Assemblage = require('../models/assemblage');
const Pictures = require('../models/picture');

/* GET home page. */
router.get('/', async function (req, res, next) {
    const collections = await Assemblage.find({})
    res.render('index', {title: 'Hui', collections});
});

router.get('/id-:id', async function (req, res, next) {
    let collectionId = req.params["id"];
    const collection = await Assemblage.findById(collectionId);
    let listOfIdPictures = collection._doc.pictures;
    let pictures = await Pictures.find({
        '_id': { $in: listOfIdPictures}});

    res.render('collection', { title: 'Hui', body: "Upload successfully", pictures, collectionId});

});

router.get('/new', function (req, res, next) {
    res.render('new-collection');
})

router.post('/new', function (req,res,next){
    let assemblageName = req.body.name;
    let assemblageDescription = req.body.description;

    let newAssemblage = new Assemblage({name:assemblageName, description: assemblageDescription});

    newAssemblage.save(function (err){
        if(err) return console.log(err);
        console.log("Ассамбляж добавлен", newAssemblage);
    });
})

module.exports = router;
