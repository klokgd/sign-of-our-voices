let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let lessMiddleware = require('less-middleware');
let mongoose = require('mongoose');
let hbs = require('hbs');
let usersRouter = require('./routes/users');
let uploadRouter = require('./routes/upload');
let collectionRouter = require('./routes/assemblage');
let app = express();
const session = require('express-session');
const Config = require('./libs/config')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = require('./libs/sessionStore');
app.use(session({
  secret: Config.session.secret,
  key: Config.session.key,
  cookie: Config.session.cookie,
  store: sessionStore,
  resave: false,
  saveUninitialized: true
}));

//const assemblageRoute = require("./routes/assemblage");

const passport = require('passport');
require('./libs/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

const common = require("./common");
app.use(common.commonMW);
require('./routes/index')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
