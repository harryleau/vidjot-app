const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// User Login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

// register from post
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2) {
    errors.push({text: 'Passwords do not match'});
  }

  if(req.body.password.length < 6) {
    errors.push({text: 'Passwords must be at least 6 characters'});
  }

  if(errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    res.send('passed');
  }
});

module.exports = router;