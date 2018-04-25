var createError = require('http-errors');
var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

global.maxMess = 100;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter  = require('./routes/api');
global.url = 'mongodb://mo7074_testowa:jgX2cpZ@136.243.156.104:27017/mo7074_testowa';
var app = express();
var longpoll = require("express-longpoll")(app, {DEBUG: true});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
var isGet = false;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/send', apiRouter);

longpoll.create('/api/poll',(req, res, next) => {
    console.log("połącznie");
    next();
})
    .then(() => {
    console.log("Created /poll");
})
    .catch((err) => {
        console.log("Something went wrong!", err);
    });

// setInterval(() => {
//     if(global.newMessege) {
//         longpoll.publish('/api/poll', { messange: global.newMessege});
//         global.newMessege = undefined;
//     }
//
// }, 500);


//mongo

MongoClient.connect(url, async (err, db) => {
   if(err) throw err;
   console.log("Connected");
   db.close()
});

// /mongo


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
