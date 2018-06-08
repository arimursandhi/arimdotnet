var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'harrypotret';

module.exports = function(app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false} }));

    passport.serializeUser(function(user, done) {
      if (user.active) {
        token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h'});

      } else {
        token = 'inactive/error';
      }

      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    passport.use(new FacebookStrategy({
        clientID: '1852515568121246',
        clientSecret: 'b08e0629429bd3a4aeb067ab9a387c90',
        callbackURL: "https://agile-dusk-75173.herokuapp.com/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
        //console.log(profile._json.email);
        User.findOne({ email: profile._json.email }).select('username active password email').exec(function(err, user) {
            if (err) done(err);

            if (user && user != null) {
              done(null, user);
            } else {
              done(err);
            }
        });
        //done(null, profile);
      }
    ));


    //
    passport.use(new TwitterStrategy({
        consumerKey: 'uO94rqsDxxVbCvXoCnbL7JOPf',
        consumerSecret: '2LEayXNF3xQc1qP1zn6dHsHPmogIpiIMlB5AemGJ4FukHJRkjp',
        callbackURL: "https://agile-dusk-75173.herokuapp.com/auth/twitter/callback",
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
      },
      function(token, tokenSecret, profile, done) {
        //console.log(profile.emails[0].value);
        User.findOne({ email: profile.emails[0].value }).select('username active password email').exec(function(err, user) {
            if (err) done(err);

            if (user && user != null) {
              done(null, user);
            } else {
              done(err);
            }
        });
      }
    ));

    passport.use(new GoogleStrategy({
        clientID: '871868821809-astj8s9k0347e6lh53c8fotdumfgiaes.apps.googleusercontent.com',
        clientSecret: 'OfS941En54maNZLDDVwtzPYj',
        callbackURL: "https://agile-dusk-75173.herokuapp.com/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        //console.log(profile);
        User.findOne({ email: profile.emails[0].value }).select('username active password email').exec(function(err, user) {
            if (err) done(err);

            if (user && user != null) {
              done(null, user);
            } else {
              done(err);
            }
        });
      }
    ));

    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
      res.redirect('/google/' + token);
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req, res) {
      res.redirect('/twitter/' + token);
    });


    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res) {
      res.redirect('/facebook/' + token);
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));

    return passport;
}
