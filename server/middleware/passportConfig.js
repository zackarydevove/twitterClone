const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const setupPassport = (app) => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({ 
          mongoUrl: process.env.MONGODB_URL,
          collectionName: 'sessions',
          ttl: 3600,
          autoRemove: 'interval',
          autoRemoveInterval: 10
        })
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ['profile', 'email'],
        },
        function(accessToken, refreshToken, profile, cb) {
            User.findOne({ googleId: profile.id })
            .then((user) => {
                if (user) {
                    return cb(null, user);
                } else {
                    const newUser = new User({
                        email: profile.displayName,
                        googleId: profile.id
                    });
                    console.log(profile.displayName);
                    newUser.save();
                }
            })
            .catch((err) => cb(err));
        }
    ));
    
    passport.use(
        new LocalStrategy({ usernameField: 'usernameOrEmail' }, (usernameOrEmail, password, done) => {
            User.findOne({ $or: [{username: usernameOrEmail}, {email: usernameOrEmail}] })
            .then((user) => {
                console.log(user);
                if (!user) {
                    return done(null, false, { message: 'Incorrect email or username.' });
                }
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return done(err);
                    }
                    if (result === true) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                })
            })
            .catch((err) => {
                console.log(err);
                done(err);
            })
        })
    )
    passport.serializeUser((user, cb) => { 	// Store a cookie in browser
        cb(null, user.id);				// and store this data in the cookie
    }) 
    
    passport.deserializeUser((id, cb) => { 	// Open the cookie to get the data inside
        User.findOne({_id: id})
        .then((user) => {
            cb(null, user);
        }) 
        .catch((err) => { 
            cb(err, null);
        });
    })
}

module.exports = setupPassport;
