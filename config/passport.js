const LocalStategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = mongoose.model('users');

module.exports = function(passport) {
  passport.use(new LocalStategy({usernameField: 'email'}, (email, password, done) => {
    // match user
    User.findOne({
      email
    }).then(user => {
      if(!user) {
        return done(null, false, {message: 'No user found'});
        // done() takes in 3 params: error, user ('false' if no user found), error message. 
      }
      
      // match password      
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if(error) throw error;
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password Incorrect'});
        }
      });
    })
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}