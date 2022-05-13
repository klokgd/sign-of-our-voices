var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var collectionName = "v-for-vendetta";


MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
    const db = client.db("sign-of-our-voices");
    userCollection = db.collection(collectionName);
    router.post("/fileupload", (req, res, next) => {
        let base64 = req.body.image;
        let data = base64.replace(/^data:image\/png;base64/, "");
        let pictureId = addToDb(userCollection);
        let pictureIdForSave = pictureId.toString() + ".jpg";
        let pathForUnload = unloadImage(pictureIdForSave, data);
        updateRecordInDb(userCollection, pathForUnload, pictureId);
        res.redirect("/fileupload/");
    });
})

function unloadImage(pictureId, pictureData) {
    let pathForUnload = path.join(__dirname, '..', 'download', pictureId);
    fs.writeFileSync(pathForUnload, pictureData, {encoding: 'base64'});
    return pathForUnload;
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

function updateRecordInDb(userCollection, pathForUnload, objectId) {
    userCollection.updateOne({_id: objectId}, {$set: {path: pathForUnload}})
        .catch(error => console.error(error));
}

module.exports = router;
