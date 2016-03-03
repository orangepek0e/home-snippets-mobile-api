//Dependencies
var express = require('express');
var port = process.env.PORT || 8080;


var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};

var configDB = require('./config/database');

//MongoDB
mongoose.connect(configDB.url);

require('./config/passport')(passport);

//Express
//morgan logs requests to our console
app.use(morgan('dev'));
//reads cookies for our auth
app.use(cookieParser());
//grabbing info from the HTML
app.use(bodyParser.urlencoded({extended:true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(allowCrossDomain);


//Passport
app.use(session({
  secret:'restInPFunk8675309',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
//persistent login
app.use(passport.session());
app.use(flash());
app.use('/public', express.static(__dirname + '/public'));

//Routes
require('./app/routes.js')(app, passport);

//Start Server
app.listen(port);
console.log('API is running on port '+ port);
