var express = require('express');                 // Express Library
var morgan = require('morgan');                   // Morgan middleware
var mongoose = require('mongoose');               // Mongoose library
var bodyParser = require('body-parser');          // BodyParser library
var ejs = require('ejs');                         // EJS library
var ejsMate = require('ejs-mate');                // EJS mate library
var session = require('session');                 // Session library
var cookieParser = require('cookie-parser');      // Cookie-parser library
var expressSession = require('express-session');  // express-session library
var flash = require('flash');                     // flash library
var portNumber = 5000;

// Note that User Schema is already being exported
var User = require('./models/user');
var app = express();

// Connect to MongoDB, please insert your password and username here for your own use
mongoose.connect('mongodb://pixelkris:213X143a@ds023452.mlab.com:23452/ecommmercewebapp', function(err) {
  if (err) {
    console.log (err);
  } else {
    console.log("Connected to the database!");
  }
});

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);

// Server Validation Message
app.listen(portNumber, function(err){
  if (err) throw err;
  console.log("Server is runnign at port: " + portNumber);
});
