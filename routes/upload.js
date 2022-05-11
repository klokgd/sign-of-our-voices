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
        let pictureId;
        let objectToInsert =
            {
            "path": "123",
            };
        userCollection.insertOne(objectToInsert)
            .then(result => {
                //pictureId = "444";
               console.log(result.insertedId.toString());
            }).catch(error => console.error(error));
        pictureId = objectToInsert._id.toString() + ".jpg";
        let pathForDownload = path.join(__dirname, '..', 'download', pictureId);
        fs.writeFileSync(pathForDownload, data, {encoding: 'base64'});
        userCollection.updateOne({_id: objectToInsert._id}, {$set: {path:pathForDownload}})
            .catch(error => console.error(error));
    });


})
module.exports = router;
