// config/passport.js — Google OAuth 2.0 strategy
// When user clicks "Continue with Google", Passport handles the
// entire flow: redirect → Google verifies → we get the profile back
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:  '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 1. Check if this Google account is already registered
          let user = await User.findOne({ googleId: profile.id });
          if (user) return done(null, user);

          // 2. Check if email already exists (signed up normally before)
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            // Link Google ID to existing account
            user.googleId = profile.id;
            if (!user.avatar) user.avatar = profile.photos?.[0]?.value || '';
            await user.save();
            return done(null, user);
          }

          // 3. Brand new user — create account from Google profile
          user = await User.create({
            googleId:   profile.id,
            name:       profile.displayName,
            email:      profile.emails[0].value,
            avatar:     profile.photos?.[0]?.value || '',
            role:       'student',
            isVerified: true  // Google already verified their email
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};
