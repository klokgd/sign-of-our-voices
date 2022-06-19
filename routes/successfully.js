const express = require("express");
const router = express.Router();

router.get('/successfully', (req, res, next) => {
    let suggestMessage = req.session.suggestMessage;
    res.render('successfully', {suggestMessage});
    req.session.suggestMessage = null;
})

module.exports = router;
