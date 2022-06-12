const Users = require('./models/user');

module.exports.commonMW = async (req, res, next) => {

    res.locals.title = 'sIGN';
    res.locals.fullYear = (new Date()).getFullYear();
    res.locals.userProfile = '';

    if (req.session.userId) {
        res.locals.userProfile = await Users.findOne({_id: req.session.userId});
        res.locals.authenticated = true;
        if (res.locals.userProfile.role == "Moderator"){
            res.locals.moderator = true;
        }
        if (res.locals.userProfile.role == "Admin"){
            res.locals.admin = true;
        }
    }
    next();
};