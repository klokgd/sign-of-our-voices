const Assemblage = require("../models/assemblage");
const pagination = require("../libs/pagination")

exports.get = async (req, res, next)=>{
    let currentPage = req.query.page || 1;
    let limit = 5;
    let query = {};
    let assemblage = await pagination.paginating(query, limit, currentPage, Assemblage);
    let count = await Assemblage.count({});
    let pages = Math.ceil(count / limit);
    let pageArray = pagination.createPageArray(pages, currentPage);
    let isStartPage = currentPage == 1 ? true : false;
    let isFinishPage = (currentPage == pages) ? true : false;
    let nextPage = currentPage + 1;

    res.render('index', { collections: assemblage,
        pages: pageArray,
        current: currentPage,
        prevPage: currentPage - 1,
        nextPage,
        isFinishPage,
        isStartPage});
}
