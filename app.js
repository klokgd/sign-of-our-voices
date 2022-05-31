let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let lessMiddleware = require('less-middleware');
let mongoose = require('mongoose');
let hbs = require('hbs');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let uploadRouter = require('./routes/upload');
let collectionRouter = require('./routes/collection');
let app = express();
const session = require('express-session');
const Config = require('./libs/config')

let mongoDB = "mongodb://127.0.0.1:27017/sign-of-our-voices";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb'}));
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

const passport = require('passport');
require('./libs/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', uploadRouter);
app.use('/collection', collectionRouter);
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
