import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from './models/user.js';
import config from './config.js';

const localOptions = {
  usernameField: 'email',
  passwordField: 'password'
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: config.secret
};

passport.use('local-login', new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, {email:'User not found'});

    user.comparePassword(password, (err, isMatch) => {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {password: 'Incorrect password'});
      }
    });
  });
}));

passport.use('local-register', new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) return done(err);
    if (user) {
      return done(null, false, {email: 'This email is already taken'});
    } else {
      let newUser = new User();

      newUser.email = email;
      newUser.password = password;
      
      newUser.save((err) => {
        if (err) return done(err);
        return done(null, newUser);
      });
    }
  });
}));

passport.use('jwt', new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.data._id, (err, user) => {
    if (err) return done(err);
    if (user) {
      done(null, user);
    } else {
      done(null, false)
    }
  });
}));