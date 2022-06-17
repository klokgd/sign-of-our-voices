const express = require("express");
const router = express.Router();
const Assemblage = require('../models/assemblage');
const path = require("path");
const multer = require("multer");
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


router.get('/', async (req, res, next) => {
    res.render('adminDashboard', {title: "sIGN Админка"})
})

router.get('/assemblage', async (req, res, next) =>{
    let assemblages = await Assemblage.find();
    res.render('adminAssemblage', {assemblages})
})

router.get('/assemblage/:id/edit', async (req, res, next) => {
    let assemblage = await Assemblage.findById(req.params["id"]);

    res.render('editAssemblage', {assemblage});
});

router.post('/assemblage/:id/edit', upload.single("cover"), async (req, res, next) => {
    let assemblageName = req.body.name;
    let assemblageDescription = req.body.description;
    let cover = req.file;
    let pathForDb;

    if (cover) {
        res.send("Ошибка при загрузке файла");
        pathForDb = path.join('download/collection_images/', cover.filename);
    }

    Assemblage.findByIdAndUpdate(req.params["id"], {$set: {name: assemblageName, description: assemblageDescription}}, function (err){
        if(err) return console.log(err)
        console.log("Ассамбляж обновлён", update);
    });

    res.redirect('successfully');
})



module.exports = router;
