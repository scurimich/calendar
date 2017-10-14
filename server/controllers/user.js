import jwt from 'jsonwebtoken';
import passport from 'passport';
import config from '../config';


export function login(req, res, next) {
  passport.authenticate('local-login', (err, user, info) => {
    if(err) return res.send({errors: err.errors});
    if(!user) return res.send({errors: info});
    res.send({
      token: 'JWT ' + generateToken(user),
      user: user.email
    });
  })(req, res, next);
}

export function register(req, res, next) {
  passport.authenticate('local-register', (err, user, info) => {
    if(err) return res.send({errors: err.errors});
    if(!user) return res.send({errors: info});
    res.send({
      token: 'JWT ' + generateToken(user),
      user: user.email
    });
  })(req, res, next);
}

export function logout(req, res, next) {
  req.logout();
}

export function auth(req, res, next) {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) return res.send({errors: err.errors});
    if (!user) return res.send({errors: info});
    res.send({
      token: 'JWT ' + generateToken(user),
      user: user.email
    });
  })(req, res, next);
}

function generateToken(user) {
  return jwt.sign({ data: user }, config.secret, {
    expiresIn: '24h'
  });
}