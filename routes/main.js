const Assemblage = require("../models/assemblage");

exports.get = async (req, res, next)=>{
    const assemblage = await Assemblage.find({})
    res.render('index', { title: 'sIGN', collections: assemblage, authenthication: req.session.id });
}
