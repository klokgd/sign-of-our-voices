var express = require('express');
const Collections = require('../models/assemblage');
const Picture = require('../models/picture');

/* GET home page. */

module.exports = (app, passport) => {

  let mainRoute = require('./main');
  app.get('/', mainRoute.get);

  let profileRoute = require('./profile');
  app.get('/profile', profileRoute.get);

  let networks = ['google', 'facebook'];
  networks.forEach(network => {
    app.get('/registration/${network}', (req, res) => {
      passport.authenticate(network, {
        scope:'email'
      })(req, res);
    });

    app.get('/registration/${network}/callback', (req,res) => {
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

};
