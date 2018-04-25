var express = require('express');
var router = express.Router();
const randomcolor = require('randomcolor');
// var cookieParser = require('cookie-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.cookies.login) {
    next('route');
  } else {
    next();
  }
}, (req, res, next) => {
  console.log('Cookies', req.cookies);
  res.render('index', { title: 'School Messenger' });
});

router.get('/', function(req, res, next) {
  res.cookie('color' , randomcolor());
  res.render('login', { title: 'School Messenger' })
});

module.exports = router;
