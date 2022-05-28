var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var collectionName = "v-for-vendetta";
const Assemblage = require('../models/assemblage');
const Pictures = require('../models/picture');

router.post("/fileupload", async (req, res, next) => {
    let base64 = req.body.image;
    let data = base64.replace(/^data:image\/png;base64/, "");
    let collectionId = req.body.collectionId;
    let picture = new Pictures({path: "123", collectionId: collectionId});
    picture.save(function (err) {
        if(err) return console.log(err);
        console.log("Картинка сохранена", picture);
    });
    let pictureId = picture._id.toString();
    let newPictureName = pictureId + ".jpg";
    let picturePath = "/download/" + newPictureName;
    uploadImage(newPictureName, data);
    picture.path = picturePath;
    addPictureToAssemblage(collectionId, picture._id);
    res.redirect("/successfully");
})

router.get("/successfully", (req, res, next) => {
    res.render('successfullyAddingImage', { title: 'sIGN' });
})

function addPictureToAssemblage(collectionId, pictureId){
    Assemblage.findByIdAndUpdate(collectionId, {$push: {pictures: pictureId}}, function(err, result){
        if(err) return console.log(err);
        console.log("Картинка добавлена в массив");
    });
}

function uploadImage(pictureId, pictureData) {
    let pathForUpload = path.join(__dirname, '..', 'public/download', pictureId);
    fs.writeFileSync(pathForUpload, pictureData, {encoding: 'base64'});
}


module.exports = router;
