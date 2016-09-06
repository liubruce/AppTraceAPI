var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var log4js = require('log4js');
var apmConfig = require('./config/config', 'dont-enclose');
var pluginManager = require('./plugins/pluginManager.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(log4js.connectLogger(log4js.getLogger("http"), {level: 'auto'}));




pluginManager.setConfigs("api", {
    domain: "",
    safe: false,
    session_duration_limit: 120,
    city_data: true,
    event_limit: 500,
    event_segmentation_limit: 100,
    event_segmentation_value_limit:1000,
    sync_plugins: false,
    session_cooldown: 15,
    total_users: true
});

pluginManager.setConfigs("apps", {
    country: "CN",
    timezone: "Asia/Shanghai",
    category: "6"
});

pluginManager.setConfigs('logs', {
    debug:      (apmConfig.logging && apmConfig.logging.debug)     ?  apmConfig.logging.debug.join(', ')    : '',
    info:       (apmConfig.logging && apmConfig.logging.info)      ?  apmConfig.logging.info.join(', ')     : '',
    warning:    (apmConfig.logging && apmConfig.logging.warning)   ?  apmConfig.logging.warning.join(', ')  : '',
    error:      (apmConfig.logging && apmConfig.logging.error)     ?  apmConfig.logging.error.join(', ')    : '',
    default:    (apmConfig.logging && apmConfig.logging.default)   ?  apmConfig.logging.default : 'warning'
}, undefined, function(config){
    var cfg = pluginManager.getConfig('logs'), msg = {cmd: 'log', config: cfg};
    if (process.send) { process.send(msg); }
    require('./api/utils/log.js').ipcHandler(msg);
});

pluginManager.init();

//http.globalAgent.maxSockets = countlyConfig.api.max_sockets || 1024;

process.on('uncaughtException', (err) => {
    console.log('Caught exception: %j', err, err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
