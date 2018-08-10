'use strict'
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var xmlParser = require('express-xml-bodyparser');

var routes = require('./routes/index');
var query = require('./routes/query');


var utils = require('./libs/utils.js');
var redisConfig = require(utils.configDir + '/config.json').redis;
var sessionConfig = require(utils.configDir + '/config.json').sessionConfig;

var app = express();

//配置模板引擎
app.set('views', path.join(__dirname, 'src'));
app.set('view engine', 'ejs');
var partials = require('express-partials');
app.use(partials());


//基本配置
app.use(favicon(path.join(__dirname, 'src/assets/touxiang@2x.png')));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({limit: '150mb', extended: false}));
app.use(cookieParser(redisConfig.secret));
app.use(xmlParser());
app.set('x-powered-by', false);

//静态文件路径
app.use(express.static(path.join(__dirname, '/src')));
//设置session使用 redis 或是临时文件
if (sessionConfig && sessionConfig.store && sessionConfig.store === 'redis') {
    console.log('---session store in redis---');
    app.use(session({
        secret: sessionConfig.secret,
        store: new RedisStore({
            host: redisConfig.host,
            port: redisConfig.port,
            ttl: redisConfig.ttl
        }),
        cookie: {maxAge: sessionConfig.maxAge, secure: false},
        resave: false,
        saveUninitialized: true
    }));
} else {//tmp file
    console.log('---session store in tmp_file---');
    app.use(session({
        secret: sessionConfig.secret,
        cookie: {maxAge: sessionConfig.maxAge, secure: false},
        resave: false,
        saveUninitialized: true
    }));
}
//session 默认1天
// app.use(session({
//   secret: redisConfig.secret,
//   store: new RedisStore({
//     host: redisConfig.host,
//     port: redisConfig.port,
//     ttl: redisConfig.ttl
//   }),
//   cookie: {maxAge: redisConfig.ttl, secure: false},
//   resave: true,
//   saveUninitialized: true
// }));

var encryptClient = require('./libs/encrypt.js');
//对于ajax数据请求做鉴权拦截
app.use(function (req, res, next) {
  var urlPath = req.path;
  if (urlPath === '/query/12333' || urlPath === '/query/insurance') {
    encryptClient.checkAJAXQuery(req, (isAuth, errmsg) => {
      // if (!isAuth) {
      // res.send(`{"result":"FALSE","errorcode":"-1","msg":${errmsg}}`);
      //     return;
      // }
      next();
    });
  } else {
    next();
  }
});


//配置文件
app.use('/', routes);
app.use('/query', query);

//404错误处理
app.use(function (req, res, next) {
  console.log(req);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers


// 开发模式错误提示
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('common/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('common/error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
