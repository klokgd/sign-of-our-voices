const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Config = require('./config');

module.exports = passport => {

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null, obj.id);
    });

    //============ GOOGLE
    passport.use('google', new GoogleStrategy({
            clientID: Config.oauth.googleAuth.clientID,
            clientSecret: Config.oauth.googleAuth.clientSecret,
            callbackURL: Config.oauth.googleAuth.callbackURL
        },
        function (request, accessToken, refreshToken, profile, done) {
            process.nextTick(() => {
                done(null, profile);
            });
        }));
};
