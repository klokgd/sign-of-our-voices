const Assemblage = require("../models/assemblage");
const pagination = require("../libs/pagination")

exports.get = async (req, res, next)=>{
    let currentPage = req.query.page || 1;
    let limit = 5;
    let assemblage = await pagination.paginating(limit, currentPage);
    let count = await Assemblage.count({});
    let pages = Math.ceil(count / limit);
    let pageArray = pagination.createPageArray(pages, currentPage);
    res.render('index', { collections: assemblage, pages: pageArray, current: currentPage});
}
