

const {ROLES} = require("../libs/roles");

module.exports = (app, passport) => {

  let mainRoute = require('./main');
  app.get('/', mainRoute.get);

  let profileRoute = require('./profile');
  app.get('/profile', profileRoute.get);

  let networks = ['google', 'facebook'];
  networks.forEach(network => {
    app.get('/registration/:network', (req, res) => {
      passport.authenticate(network, {
        scope:'email'
      })(req, res);
    });

    app.get('/registration/:network/callback', (req,res) => {
      passport.authenticate(network, {
        successRedirect: '/auth-success',
        failureRedirect: '/auth-error'
      })(req, res)
    });
  })

  let authSuccess = require('./authSuccess');
  app.get('/auth-success', authSuccess.get);

  let logoutRoute = require('./logout');
  app.get('/logout', logoutRoute.get);

  let assemblageRoute = require('./assemblage');
  app.use('/assemblage', assemblageRoute);

  let uploadRoute = require('./upload');
  app.use('/', uploadRoute);

  let adminRoute = require('./admin');
  app.use('/admin', passport.checkIsInRole(ROLES.Admin), adminRoute)

  let moderatorRoute = require('./moderator');
  app.use('/moderator', passport.checkIsInRole(ROLES.Moderator), moderatorRoute);
};
