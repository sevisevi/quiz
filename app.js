var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para después de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

// Auto-Logout
app.use(function (req, res, next) {
  var inactividad = 2;
  var timeout = inactividad*60*1000;	//minutos en milisegundos

  // Existe la sesión
  if (req.session.user) {
    // Se inicializa o se recupera la última petición
    req.session.ultimaPeticion = req.session.ultimaPeticion || new Date().getTime();

    // Tiempo entre peticiones
    var ahora = new Date();
    var diferencia = ahora.getTime() - req.session.ultimaPeticion;

    // Si ha pasado mas de "timeout" desde la última petición, cerramos la sesión        
    if (diferencia > timeout) {
      console.log('Cerrando sesión automáticamente, ' + inactividad + ' minutos de inactividad.')
      delete req.session.user;
    }
        
    // Actualizamos ultima peticion
    req.session.ultimaPeticion = ahora.getTime();
        
    console.log('Última petición realizada ' + ahora)
  }

  next();
});

app.use('/', routes);

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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
