var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');//引入cors，支持跨域
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//配置cors
app.use(cors({
	origin: ['http://127.0.0.1:8080'],//运行这个域的访问
	method: ['GET', 'POST'],//只允许GET和POST请求
	allowedHeaders: ['Content-type', 'Authorization']//只允许带这两种请求头的链接访问
}));

//配置mongoose
mongoose.set('debug', true);//enable logging collection methods + arguments to the console.
mongoose.connect('mongodb://127.0.0.1/note', {useNewUrlParser: true});
mongoose.connection.on('connected', function () {
    console.log('connect mongodb success...');
});
// var defUser = new mongoose.model('user', { name: String,password:String });
// var kitty = new defUser({ name: 'admin',password:"123" });
// kitty.save(function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('meow');
//   }
// });
mongoose.connection.on('error',function (err) {
    console.log('connect mongodb failed: '+ err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', indexRouter);
app.use('/user', usersRouter);

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
