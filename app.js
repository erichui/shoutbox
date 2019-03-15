var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');

// var index = require('./routes/index');
var users = require('./routes/users');
const register = require('./routes/register')
const login = require('./routes/login')
const logout = require('./routes/logout')
const entries = require('./routes/entries')
const post = require('./routes/post')
const api = require('./routes/api')

const notFound = require('./routes/404')

const messages = require('./lib/messages')
const user = require('./lib/middleware/user')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(messages)

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api)
app.use(user)
app.use('/', entries);
app.use('/users', users);
app.use('/register', register)
app.use('/login', login)
app.use('/logout', logout)
app.use('/post', post)
app.use(notFound)

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
