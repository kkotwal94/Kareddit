//server.js

//set up =========================================
// get all the tools we need

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose'); // mongo
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');
//configuration ===================================
require('./app/models/comments.js');
require('./app/models/posts.js');
mongoose.connect(configDB.url); //connect to our database with module.export

require('./config/passport')(passport); //pass passport for config
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
//set up our express app
app.use(morgan('dev')); //log every request to teh console
app.use(cookieParser()); //read our cookies for auth
app.use(bodyParser()); //get information from html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/'));
app.set('view engine', 'ejs'); //use ejs for templating

//required for passport
app.use(session({ secret: 'karansecret'}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //use connect flash for flash messages stored in session





//launch

require('./app/routes.js')(app, passport); //load our routes and pass in our app and fully configured passport

app.listen(port);
console.log('Listening to server on port ' + port);
