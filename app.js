var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var rfs = require('rotating-file-stream');
var cors = require('cors');//引入cors，支持跨域
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
mongoose.Promise = global.Promise;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 日志 start
var logDirectory = path.join(__dirname, 'log')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

/**
 * 日志命名
 * @return {[type]} [description]
 */
function getLogFilename() {
  var day = new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate();
  return 'access' + day + '.log';
}
// create a rotating write stream
var accessLogStream = rfs(getLogFilename(), {
  interval: '1d', // rotate daily
  path: logDirectory
})
logger.token(function() {

});

// setup the logger
logger.format('dev', '[dev]:remote-addr - :remote-user :date[iso] :method :url :status :res[content-length] - :response-time ms :referrer :user-agent');
app.use(logger('dev', {
  stream: accessLogStream
}));
// 日志 end

//配置cors
app.use(cors({
	origin: ['http://127.0.0.1:8080'],//运行这个域的访问
	method: ['GET', 'POST'],//只允许GET和POST请求
	// allowedHeaders: ['Content-type', 'Authorization']//只允许带这两种请求头的链接访问
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'xsq',//String类型的字符串，作为服务器端生成session的签名
  resave: true,//(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存。默认为true
  saveUninitialized: true//初始化session时是否保存到存储。默认为true
}));

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
