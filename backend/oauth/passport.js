const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const adminSchema = require('../models/adminSchema');
const bcrypt = require('bcrypt');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    adminSchema.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await adminSchema.findOne({ email: profile.emails[0].value });

                if (existingUser) {
                    return done(null, existingUser);
                }

                const newUser = new adminSchema({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10),
                });

                const savedUser = await newUser.save();
                done(null, savedUser);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
