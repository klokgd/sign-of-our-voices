var express = require('express');
var path = require('path');
var router = express.Router();
const Assemblage = require('../models/assemblage');
const Pictures = require('../models/picture');
const multer = require('multer');
const pagination = require("../libs/pagination");
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/download/collection_images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});

const upload = multer({storage: storageConfig, fileFilter: fileFilter});

router.get('/', async function (req, res, next) {
    let currentPage = req.query.page || 1;
    let limit = 5;
    let assemblage = await pagination.paginating(limit, currentPage, Assemblage);
    let count = await Assemblage.count({});
    let pages = Math.ceil(count / limit);
    let pageArray = pagination.createPageArray(pages, currentPage);
    res.render('index', {collections: assemblage, pages: pageArray, current: currentPage});
}); //

router.get('/id/:id', async function (req, res, next) {
    let collectionId = req.params["id"];
    let currentPage = req.query.page || 1;
    let limit = 9;
    let query = {'collectionId': collectionId};
    let picturesCount = await Pictures.find(query).count();
    let pictures = await pagination.paginating(query, limit, currentPage, Pictures);
    let pages = Math.ceil(picturesCount / limit);
    let pageArray = pagination.createPageArray(pages, currentPage);
    let isStartPage = currentPage == 1 ? true : false;
    let isFinishPage = (currentPage == pages) ? true : false;

    res.render('assemblage', {
        body: "Upload successfully",
        pictures,
        collectionId,
        pages: pageArray,
        current: currentPage,
        prevPage: currentPage - 1,
        nextPage: parseInt(currentPage, 10) + 1,
        isStartPage,
        isFinishPage
    });
});

router.get('/new', function (req, res, next) {
    res.render('newCollection');
})

router.get('/successfully', function (req, res, next) {
    let suggestMessage = req.session.suggestMessage;
    res.render('successfully', {suggestMessage});
    req.session.suggestMessage = null;
})

router.get('/id/:id/statistic', async function (req, res, next) {
    let collectionId = req.params["id"];
    let statistic = await Pictures.aggregate([
            {$match: {collectionId: collectionId}},
            {
                $group: {
                    _id: "$city",
                    count: {$sum: 1}
                }
            },
            {
                $sort: { "count": -1 }
            }
        ])
    ;
    res.render('statistic', {statistic});
})


router.post('/new', upload.single("cover"), async function (req, res, next) {
    let assemblageName = req.body.name;
    let assemblageDescription = req.body.description;
    let cover = req.file;
    if (!cover) {
        res.send("???????????? ?????? ???????????????? ??????????");
    }
    let pathForDb = path.join('download/collection_images/', cover.filename);
    let newAssemblage = new Assemblage({
        name: assemblageName,
        description: assemblageDescription,
        image_path: pathForDb
    });

    newAssemblage.save(function (err) {
        if (err) return console.log(err);
        console.log("?????????????????? ????????????????", newAssemblage);
    });
    req.locals.suggestMessage = "?????????????????? ?????????????? ????????????????.";
    res.redirect('/successfully');
});


module.exports = router;
