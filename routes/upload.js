var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
const Assemblage = require('../models/assemblage');
const Pictures = require('../models/picture');
const suggestPicture = require("../models/suggestPicture");

router.post("/fileupload", async (req, res, next) => {
    req.session.collectionIdSuccessfullyAddingPicture = null;
    let base64 = req.body.image;
    let data = base64.replace(/^data:image\/png;base64/, "");
    let collectionId = req.body.collectionId;
    let city = req.body.city;
    let assemblage = await Assemblage.findById(collectionId).exec();
    let picture = new suggestPicture({path: "123", collectionId: collectionId, assemblageName: assemblage._doc.name, city: city});
    picture.save(function (err) {
        if(err) return console.log(err);
        console.log("Картинка добавлена в предложку", picture);
    });
    let pictureId = picture._id.toString();
    let newPictureName = pictureId + ".jpg";
    let picturePath = "/download/" + newPictureName;
    uploadImage(newPictureName, data);
    picture.path = picturePath;
    req.session.collectionIdSuccessfullyAddingPicture = collectionId;
    res.redirect("/successfully");
});

router.get("/successfully", (req, res, next) => {
    res.render('successfullyAddingImage', { id: req.session.collectionIdSuccessfullyAddingPicture});
});



function uploadImage(pictureId, pictureData) {
    let pathForUpload = path.join(__dirname, '..', 'public/download', pictureId);
    fs.writeFileSync(pathForUpload, pictureData, {encoding: 'base64'});
};


module.exports = router;
