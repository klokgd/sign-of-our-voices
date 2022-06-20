const suggestPicture = require("../models/suggestPicture");
const express = require("express");
const router = express.Router();
const Picture = require("../models/picture")
const Assemblage = require("../models/assemblage");
const User = require("../models/user");

router.get('/', async (req, res, next) => {
    res.render('moderatorDashboard', {title: "sIGN Модераторка"})
})

router.get('/suggest', async (req, res, next) => {
    const pictures = await suggestPicture.find({})
    res.render('suggestPictures', {title: "sIGN предложка", pictures: pictures});
});

router.post('/suggest/approve', async (req, res, next) => {
    const callbackUrl = "/moderator/suggest/approve";
    let suggest = await suggestPicture.findById(req.body.pictureId).exec();

    if (req.body.cancel) {
        deleteItemFromCollection(suggest);
        req.session.suggestMessage = "Картинка удалена из предложки.";
        return res.redirect(callbackUrl);
    }
    let newPicture = await addPictureToDb(suggest);
    await addPictureToAssemblage(suggest._doc.collectionId, newPicture._id);
    await deleteItemFromCollection(suggest);
    req.session.suggestMessage = "Картинка одобрена!";
    res.redirect(callbackUrl);
});

router.get('/suggest/approve', (req, res, next) => {
    res.render("suggestApprove", {message: req.session.suggestMessage});
    req.session.suggestMessage = null;
});

router.get('/rating', async (req, res, next) => {
    let users = await User.find();
    res.render("updateUserRating", {users});
})

router.post('/rating/:id', async (req, res, next) => {
    let user = await User.findById(req.params["id"]);
    let newRating = parseInt(user._doc.rating, 10) + 1;
    await User.findByIdAndUpdate(req.params["id"], {
        $set:
            {
                rating: newRating
            }
    });
    req.session.suggestMessage = "Репутация успешно повышена";
    res.redirect("/successfully");
})

async function addPictureToDb(suggest){
    let newPicture = new Picture({path: suggest._doc.path, collectionId: suggest._doc.collectionId, data: suggest._doc.data, city: suggest._doc.city});
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

