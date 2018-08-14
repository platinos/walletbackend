var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/profile');
var contentRouter = require('./routes/contents');
var testdb = require('./routes/testdb');
var commentRouter = require('./routes/comment');
var walletRouter = require('./routes/wallet')
var shopRouter = require('./routes/shop');
var productRouter = require('./routes/product');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
  next();



})

//Database connection
global.mongoose = require('mongoose');
mongoose.connect('mongodb://shequser:shequserpass1@ds133550.mlab.com:33550/mynosqldb')
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));





app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/content', contentRouter);
app.use('/test', testdb);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/shop', shopRouter);
app.use('/api/v1/product', productRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;