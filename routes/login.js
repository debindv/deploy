const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

require('../config/passport')(passport); 
 
 
router.get('/', (req,res) => res.render('login'));

router.get('/:id', (req,res) => {
  var token = req.params.id;
  User.findOne({token:token}).then((user) => {
    user.verified = 'true';
    user.save().then(() => {
      console.log(`user email verified status: ${user.verified}`);
      req.flash('success_msg','Email ID has been verified');
      res.render('login');
    }).catch((err) => console.log(err));
    
  }).catch(err => console.log(error));
});

 
router.post('/',(req, res, next) => {
 
    module.exports.email = req.body.email;
    passport.authenticate('user-local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });
 
 
 
 
module.exports = router;