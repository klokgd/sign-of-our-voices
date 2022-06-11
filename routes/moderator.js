const suggestPicture = require("../models/suggestPicture");
const express = require("express");
const router = express.Router();
const Picture = require("../models/picture")
const Assemblage = require("../models/assemblage");

router.get('/suggest', async (req, res, next) => {
    const pictures = await suggestPicture.find({})
    res.render('suggestPictures', {title: "sIGN предложка", pictures: pictures});
});

router.post('/suggest/approve', async (req, res, next) => {
    const callbackUrl = "/moderator/suggest/approve";
    let suggest = await suggestPicture.findById(req.body.pictureId).exec();

    if (req.body.cancel) {
        deleteItemFromCollection(suggest);
        req.session.suggestMessage = "Картинка удалена из предложки";
        return res.redirect(callbackUrl);
    }
    let newPicture = await addPictureToDb(suggest);
    await addPictureToAssemblage(suggest._doc.collectionId, newPicture._id);
    await deleteItemFromCollection(suggest);
    req.session.suggestMessage = "Картинка одобрена";
    res.redirect(callbackUrl);
});

router.get('/suggest/approve', (req, res, next) => {
    res.render("suggest-approve", {message: req.session.suggestMessage});
    req.session.suggestMessage = null;
})

async function addPictureToDb(suggest){
    let newPicture = new Picture({path: suggest._doc.path, collectionId: suggest._doc.collectionId});
    newPicture.save(function (err) {
        if (err) return console.log(err);
        console.log("Картинка успешно одобрена", Picture);
    });
    return newPicture;
}

async function addPictureToAssemblage(collectionId, pictureId) {
    Assemblage.findByIdAndUpdate(collectionId, {$push: {pictures: pictureId}}, function (err, result) {
        if (err) return console.log(err);
        console.log("Картинка добавлена в массив к ассамбляжу");
    });
};

async function deleteItemFromCollection(item){
    item.deleteOne(function (err) {
        if (err) return console.log(err);
        console.log("Картинка удалена из предложки");
    })
}

module.exports = router;

