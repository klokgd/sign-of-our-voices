var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');

router.post("/fileupload",(req, res, next) => {
    var base64 = req.body.image;
    var data = base64.replace(/^data:image\/png;base64/, "");
    var pathForDonwload = path.join(__dirname, '..', 'download', 'newImage.jpg');
    fs.writeFileSync( pathForDonwload, data, {encoding: 'base64'});
});

module.exports = router;
