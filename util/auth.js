var crypto = require('crypto'),
    LocalStrategy = require('passport-local').Strategy;

    //User = require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(user_id, done) {
        done(null, {username: 'admin', id: '1'})
        // new User({id: user_id}).fetch().then(function(user) {
        //     return done(null, user);
        // }, function(error) {
        //     return done(error);
        // });
    });


    passport.use(new LocalStrategy({
        usernameField: 'un',
        passwordField: 'pw'
    },function(username, password, done) {
        done(null, {username: 'admin', id: '1'})
        // new User({username: username}).fetch({require: true}).then(function(user) {
        //     var sa = user.get('salt');
        //     var pw = user.get('password');
        //     var upw = crypto.createHmac('sha1', sa).update(password).digest('hex');
        //     if(upw == pw) {
        //         return done(null, user);
        //     }
        //     return done(null, false, { 'message': 'Invalid password'});
        // }, function(error) {
        //     return done(null, false, { 'message': 'Unknown user'});
        // });
    }));
};
