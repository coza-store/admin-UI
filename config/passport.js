const passport = require('passport');
const Admin = require('../models/adminModel');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, user) {
        done(err, user);
    })
});

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    Admin.findOne({ 'email': email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Admin Not Found' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect Password' });
        }
        return done(null, user);
    });
}));