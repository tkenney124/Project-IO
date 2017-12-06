var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// new stuff starts here
var session = require('express-session');
var flash = require('express-flash');
var env = require('dotenv').config();

const Client = require('pg').Client;
const client = new Client({
  connectionString: process.env.DATABASE_URL
});
client.connect(); //connect to database

// javascript password encryption (https://www.npmjs.com/package/bcryptjs)
var bcrypt = require('bcryptjs');
//  authentication middleware
var passport = require('passport');
// authentication locally (not using passport-google, passport-twitter, passport-github...)
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'username', // form field
    passwordField: 'password'
  },
  function(username, password, done) {
<<<<<<< HEAD
    client.query('SELECT * FROM IO_users WHERE username = $1', [username], function(err, result) {
=======
    client.query('SELECT * FROM users WHERE username = $1', [username], function(err, result) {
>>>>>>> 33934d58683e82f54f223a5e9bd9e93ba16e54ee
      if (err) {
        console.log("SQL error");
        //next(err);
        return done(null,false, {message: 'sql error'});
      }
      if (result.rows.length > 0) {
        var matched = bcrypt.compareSync(password, result.rows[0].password);
        if (matched) {
          console.log("Successful login, ", result.rows[0]);
          return done(null, result.rows[0]);
        }
      }
      console.log("Bad username or password");
      // returning to passport
      // message is passport key
      return done(null, false, {message: 'Bad username or password'});
    });
  })
);

// Store user information into session
passport.serializeUser(function(user, done) {
  //return done(null, user.id);
  return done(null, user);
});

// Get user information out of session
passport.deserializeUser(function(id, done) {
  return done(null, id);
});

// Use the session middleware
// configure session object to handle cookie
// req.flash() requires sessions
app.use(session({
  secret: 'COMP335',
  resave:false,
  saveUninitialized: true,
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// new stuff ends here

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
<<<<<<< HEAD
app.use(express.static(path.resolve('./public')));
app.use('/public', express.static(path.resolve('./public')));
=======
>>>>>>> 33934d58683e82f54f223a5e9bd9e93ba16e54ee
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
