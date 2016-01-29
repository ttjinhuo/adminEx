
// TODO: Find a better way to load different configs in different env
var dbConfig;
try {
    // Look for dev conf for local development
    dbConfig = require('./config/db.dev.conf.js');
} catch(e) {
    try {
        // production conf?
        dbConfig = require('./config/db.conf.js');
    } catch(e) {
        console.log('Startup failed.  No db config file found.');
        return false;
    }
}


var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    oauthserver = require('oauth2-server'),

    mysql = require('mysql'),
    session = require('express-session'),
    SessionStore = require('express-mysql-session'),
    
    serveStatic = require('serve-static'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    swig = require('swig'),
    swigRender = require('./config/swig.conf'),
    passport = require('passport'),
    crypto = require('crypto'),
    messages = require('./util/messages');

var app = express();
app.use(cookieParser('halsisiHHh445JjO0'));

var sessionStore = new SessionStore(dbConfig);
app.use(session({
    key: 'session_sid',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(serveStatic('./build/public/'));
//app.use(express.favicon(__dirname + '/public/images/shortcut-icon.png'));
app.use(messages());


require('./util/auth')(passport);
require('./routes')(app, passport);

app.listen(process.env.PORT || 3004);
console.log('adminEx listening on port 3004');
