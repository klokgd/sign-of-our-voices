var express = require('express');
var path = require('path');
var router = express.Router();
const Assemblage = require('../models/assemblage');
const Pictures = require('../models/picture');
const multer = require('multer');
const fileFilter = (req, file, cb) => {

    if(file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"||
        file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public/download/collection_images");
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});

const upload = multer({storage: storageConfig,  fileFilter: fileFilter});

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

router.get('/successfully', function (req, res, next) {
    res.render('successfullyAddingAssemblage');
})

router.post('/new', upload.single("cover"), async function (req,res,next){
    let assemblageName = req.body.name;
    let assemblageDescription = req.body.description;
    let cover = req.file;
    if (!cover){
        res.send("Ошибка при загрузке файла");
    }
    let pathForDb = path.join('download/collection_images/', cover.filename);
    let newAssemblage = new Assemblage({name:assemblageName, description: assemblageDescription, image_path: pathForDb});

    newAssemblage.save(function (err){
        if(err) return console.log(err);
        console.log("Ассамбляж добавлен", newAssemblage);
    });
    res.redirect('successfully');
});



module.exports = router;
