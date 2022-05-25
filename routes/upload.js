var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var collectionName = "v-for-vendetta";
const Collections = require('../models/collection');
const Pictures = require('../models/picture');

router.post("/fileupload", async (req, res, next) => {
    let base64 = req.body.image;
    let collectionId = req.body.collectionId;
    let data = base64.replace(/^data:image\/png;base64/, "");
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
    Collections.findByIdAndUpdate(collectionId, {$push: {pictures: picture._id}}, function(err, result){
        if(err) return console.log(err);
        console.log("Картинка добавлена в массив");
    });
    res.redirect("http://127.0.0.1:3000/successfully");
})

router.get("/successfully", (req, res, next) => {
    res.render('successfully', { title: 'sIGN' });
})

function uploadImage(pictureId, pictureData) {
    let pathForUnload = path.join(__dirname, '..', 'public/download', pictureId);
    fs.writeFileSync(pathForUnload, pictureData, {encoding: 'base64'});
}

function addToDb(userCollection) {
    let objectToInsert =
        {
            "path": "",
        };
    userCollection.insertOne(objectToInsert)
        .then(result => {
            console.log(result.insertedId.toString());
        }).catch(error => console.error(error));
    return objectToInsert._id;
}

function addToCollection(collectionId){

}

function updateRecordInDb(userCollection, pathForUnload, objectId) {
    userCollection.updateOne({_id: objectId}, {$set: {path: pathForUnload}})
        .catch(error => console.error(error));
}

module.exports = router;
